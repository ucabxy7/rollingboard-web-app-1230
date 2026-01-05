import { mergeTwClasses } from "@/utils/styles/tailwindCss";
import IntegrateIcon from "@/public/svgs/integrate.svg";
import CollaborateIcon from "@/public/svgs/collaborate.svg";
import SucceedIcon from "@/public/svgs/succeed.svg";
import { getTranslations } from "next-intl/server";

const FeatureDescription = async () => {
  const t = await getTranslations();

  const featureInfo = [
    {
      title: t("featureDescriptions.integrate.title"),
      description: t("featureDescriptions.integrate.description"),
      icon: IntegrateIcon,
    },
    {
      title: t("featureDescriptions.collaborate.title"),
      description: t("featureDescriptions.collaborate.description"),
      icon: CollaborateIcon,
    },
    {
      title: t("featureDescriptions.succeed.title"),
      description: t("featureDescriptions.succeed.description"),
      icon: SucceedIcon,
    },
  ];

  return (
    <section className="flex w-full flex-col items-center gap-12 px-4 py-15">
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-12 max-w-7xl w-full">
        {featureInfo.map((feature, index) => (
          <div
            key={`${feature.title}-${index}`}
            className={mergeTwClasses(
              "bg-linear-to-b from-dark-9 to-transparent border border-gray-8 rounded-2xl flex flex-col items-center gap-7 px-5 py-15 w-full md:w-80",
            )}
          >
            <div className="size-10 flex items-center justify-center shrink-0">
              <feature.icon
                aria-hidden={true}
                className="size-10 text-cyan-6"
              />
            </div>
            <div className="flex flex-col gap-2 items-center text-center w-full">
              <p className="text-white text-large leading-large font-semibold">
                {feature.title}
              </p>
              <p className="text-dark-2 text-medium leading-medium">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureDescription;
