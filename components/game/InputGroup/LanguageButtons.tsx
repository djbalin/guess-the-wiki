import { useLanguageContext } from "@/contexts/LanguageContext";
import {
  DEFAULT_LANGUAGE,
  Languages,
  flagComponents,
} from "@/resources/TypesEnums";
import { setCookie, getCookie } from "cookies-next";
import { DK, FR, GB, ES, DE } from "country-flag-icons/react/3x2";

function storeLanguageSettings(language: Languages) {
  console.log("STORING LANGUAGE COOKIE: " + language);
  setCookie("language", language);
}

const activeLanguage = "scale-110 border-2 border-black border-opacity-15  p-1";

export default function LanguageButtons() {
  const chosenLanguage = getCookie("language");
  const languageContext = useLanguageContext();
  const language = languageContext.language;
  if (!chosenLanguage) {
    storeLanguageSettings(DEFAULT_LANGUAGE);
  }

  //   flagComponents[Languages.Danish];
  //   Object.keys(Languages).forEach((el) => console.log(el));

  return (
    <>
      <button className={`${language == Languages.Danish && activeLanguage}`}>
        <DK
          onClick={(e) => {
            languageContext.setLanguage(Languages.Danish);
            storeLanguageSettings(Languages.Danish);
          }}
          className={`w-12 h-auto border-2"
          }`}
        />
      </button>
      <button className={`${language == Languages.French && activeLanguage}`}>
        <FR
          onClick={(e) => {
            languageContext.setLanguage(Languages.French);
            storeLanguageSettings(Languages.French);
          }}
          className="w-12 h-auto"
        ></FR>
      </button>
      <button className={`${language == Languages.English && activeLanguage}`}>
        <GB
          onClick={(e) => {
            languageContext.setLanguage(Languages.English);
            storeLanguageSettings(Languages.English);
          }}
          className="w-12 h-auto"
        ></GB>
      </button>
      <button className={`${language == Languages.German && activeLanguage}`}>
        <DE
          onClick={(e) => {
            languageContext.setLanguage(Languages.German);
            storeLanguageSettings(Languages.German);
          }}
          className="w-12 h-auto"
        ></DE>
      </button>
      <button className={`${language == Languages.Spanish && activeLanguage}`}>
        <ES
          onClick={(e) => {
            languageContext.setLanguage(Languages.Spanish);
            storeLanguageSettings(Languages.Spanish);
          }}
          className="w-12 h-auto"
        ></ES>
      </button>
    </>
  );
}
