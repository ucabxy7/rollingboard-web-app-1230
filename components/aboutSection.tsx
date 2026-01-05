import { mergeTwClasses } from "@/utils/styles/tailwindCss";
import ProjectIcon from "@/public/svgs/project-icon.svg";
import ReactIcon from "@/public/svgs/react-icon.svg";
import TypescriptIcon from "@/public/svgs/typescript-icon.svg";
import { getTranslations } from "next-intl/server";
export default async function AboutSection() {
  const t = await getTranslations();

  const tagColors = {
    [t("aboutScreen.tags.design")]: "bg-linear-to-r from-indigo-6 to-cyan-6 ",
    [t("aboutScreen.tags.api")]: "bg-linear-to-r from-indigo-6 to-blue-8 ",
    [t("aboutScreen.tags.features")]: "bg-linear-to-r from-pink-8 to-red-6 ",
    [t("aboutScreen.tags.router")]: "bg-linear-to-r from-red-7 to-grape-7 ",
    [t("aboutScreen.tags.markUp")]: "bg-linear-to-r from-grape-6 to-violet-6 ",
  };

  const aboutProjectInfo = [
    {
      name: t("aboutScreen.aboutProjectInfo.alex.name"),
      tags: [
        t("aboutScreen.tags.design"),
        t("aboutScreen.tags.api"),
        t("aboutScreen.tags.features"),
      ],
      description: t("aboutScreen.aboutProjectInfo.alex.description"),
    },
    {
      name: t("aboutScreen.aboutProjectInfo.gabriel.name"),
      tags: [
        t("aboutScreen.tags.router"),
        t("aboutScreen.tags.api"),
        t("aboutScreen.tags.features"),
      ],
      description: t("aboutScreen.aboutProjectInfo.gabriel.description"),
    },
    {
      name: t("aboutScreen.aboutProjectInfo.marcus.name"),
      tags: [
        t("aboutScreen.tags.markUp"),
        t("aboutScreen.tags.api"),
        t("aboutScreen.tags.features"),
      ],
      description: t("aboutScreen.aboutProjectInfo.marcus.description"),
    },
  ];

  return (
    <section className="flex w-full flex-col items-center gap-8 py-16 text-left relative overflow-hidden">
      <div
        className="md:opacity-80 opacity-0 w-[1000px] h-[1000px] rounded-[500px] absolute top-[-60%] lg:left-[-750px] md:left-[-800px] left-[-900px] rotate-110 
      z-[-1] bg-[linear-gradient(90deg,var(--color-grape-4)_0%,var(--color-indigo-5)_33%,var(--color-cyan-4)_66%,yellow_100%)] blur-md"
      ></div>
      <h1 className="text-center text-h1 font-bold text-white">
        {t("aboutScreen.title")}
      </h1>

      <div className="flex w-full max-w-[500px] flex-col gap-6">
        {aboutProjectInfo.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className={mergeTwClasses(
              index % 2 !== 0 ? "bg-linear-to-r" : "bg-linear-to-l",
              "rounded-2xl from-dark-9 to-transparent px-6 py-5 sm:px-8 sm:py-10",
            )}
          >
            <header className="mb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-large font-semibold text-white">
                  {item.name}
                </h2>
                <ProjectIcon className="size-5 text-white" />
              </div>
              <div className="mt-3 flex gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className={mergeTwClasses(
                      "rounded-full px-3.5 py-1 font-bold text-x-small text-white",
                      tagColors[tag],
                    )}
                  >
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>
            </header>

            <p className="mt-2 text-small leading-small text-dark-2">
              {item.description}
            </p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-x-small leading-small text-dark-3">
          {t("aboutScreen.builtWith")}
        </p>
        <div className="flex gap-2 justify-evenly">
          <ReactIcon className="size-4 stroke-dark-3" />
          <TypescriptIcon className="size-4 fill-dark-3" />
        </div>
      </div>
    </section>
  );
}
