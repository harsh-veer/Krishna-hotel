import type { Metadata } from "next";
import { HOTEL_NAME } from "@/lib/hotel";
import { languageAlternates, pageUrls } from "@/lib/i18n/seo";
import Home from "../page";

// Hindi home page: the same sections as "/", rendered in Hindi on the server because the
// LanguageProvider picks the language from the /hi URL.
const { hi: url } = pageUrls("/");
const title = "कृष्णा होटल अंबेडकर नगर | अयोध्या-अकबरपुर रोड पर किफ़ायती होटल";
const description =
  "कृष्णा होटल (Krishna Hotel), अयोध्या-अकबरपुर रोड, अंबेडकर नगर में साफ़-सुथरे और आरामदायक कमरे ₹999 से, एसी कमरे ₹1,200 से। मुफ़्त नाश्ता, मुफ़्त वाई-फ़ाई, सुरक्षित पार्किंग और परिवार के लिए भरोसेमंद ठहराव।";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url, languages: languageAlternates("/") },
  openGraph: {
    type: "website",
    siteName: HOTEL_NAME,
    locale: "hi_IN",
    url,
    title,
    description,
    images: [{ url: "/images/gallery-daytime-front.jpg", alt: "कृष्णा होटल का सामने का दृश्य" }],
  },
};

export default Home;
