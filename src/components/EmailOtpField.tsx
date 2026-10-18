"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import { EMAIL_ERROR, isValidBookingEmail } from "@/lib/validation";

interface EmailOtpFieldProps {
    email: string;
    onEmailChange: (email: string) => void;
    verified: boolean;
    onVerifiedChange: (verified: boolean) => void;
    id?: string;
    label?: string;
    labelClassName?: string;
    inputClassName?: string;
    buttonClassName?: string;
}

// Email input with a "Send code" step. The booking API only accepts emails verified here.
export default function EmailOtpField({
    email,
    onEmailChange,
    verified,
    onVerifiedChange,
    id = "email",
    label = "Email Address",
    labelClassName = "block text-sm font-medium text-gray-700 mb-1",
    inputClassName = "w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-royal-blue focus:outline-none focus:ring-1 focus:ring-royal-blue bg-gray-50/50",
    buttonClassName = "shrink-0 rounded-lg bg-royal-blue px-4 text-sm font-semibold text-white hover:bg-royal-blue-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
}: EmailOtpFieldProps) {
    const [codeSent, setCodeSent] = useState(false);
    const [code, setCode] = useState("");
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    // A new address needs a new code.
    const handleEmailChange = (value: string) => {
        onEmailChange(value);
        if (verified) onVerifiedChange(false);
        setCodeSent(false);
        setCode("");
    };

    const sendCode = async () => {
        if (!isValidBookingEmail(email)) {
            toast.error(EMAIL_ERROR);
            return;
        }
        setSending(true);
        try {
            const res = await fetch("/api/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() }),
            });
            const data = await res.json();
            if (!res.ok) {
                if (data.retryAfter) setCooldown(data.retryAfter);
                throw new Error(data.error || "Could not send the code.");
            }
            setCodeSent(true);
            setCooldown(60);
            toast.success(`Code sent to ${email.trim()}. Check your inbox and spam folder.`);
        } catch (err: any) {
            toast.error(err.message || "Could not send the code.");
        } finally {
            setSending(false);
        }
    };

    const verifyCode = async () => {
        setVerifying(true);
        try {
            const res = await fetch("/api/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), code: code.trim() }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Verification failed.");
            onVerifiedChange(true);
            toast.success("Email verified.");
        } catch (err: any) {
            toast.error(err.message || "Verification failed.");
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="space-y-2">
            <label htmlFor={id} className={labelClassName}>{label}</label>
            <div className="flex gap-2">
                <input
                    type="email"
                    id={id}
                    name="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className={inputClassName}
                    placeholder="you@example.com"
                />
                {verified ? (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 text-sm font-semibold text-green-700">
                        <CheckCircle2 className="h-4 w-4" /> Verified
                    </span>
                ) : (
                    <button type="button" onClick={sendCode} disabled={sending || cooldown > 0} className={buttonClassName}>
                        {sending ? "Sending..." : cooldown > 0 && codeSent ? `Resend ${cooldown}s` : codeSent ? "Resend" : "Send code"}
                    </button>
                )}
            </div>

            {codeSent && !verified && (
                <div className="flex gap-2">
                    <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                if (code.length === 6) verifyCode();
                            }
                        }}
                        className={`${inputClassName} tracking-[0.4em] font-semibold`}
                        placeholder="6-digit code"
                        aria-label="Verification code"
                    />
                    <button type="button" onClick={verifyCode} disabled={verifying || code.length !== 6} className={buttonClassName}>
                        {verifying ? "Checking..." : "Verify"}
                    </button>
                </div>
            )}
        </div>
    );
}
