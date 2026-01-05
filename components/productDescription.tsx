/* eslint-disable @next/next/no-img-element */
import { mergeTwClasses } from "@/utils/styles/tailwindCss";
import TickCircle from "@/public/svgs/tick-circle.svg";
import KanbanImage from "@/public/images/kanban.png";
import LoginCardImage from "@/public/images/login-card.png";
import ProjectsImage from "@/public/images/projects.png";
import { getTranslations } from "next-intl/server";

const IMAGE_WIDTH = 500;

const ProductDescription = async () => {
  const t = await getTranslations();

  const productDescriptionInfo = [
    {
      flag: t("productDescriptions.universal.flag"),
      title: t("productDescriptions.universal.title"),
      description: t("productDescriptions.universal.description"),
      imageUrl: ProjectsImage,
    },
    {
      flag: t("productDescriptions.optimized.flag"),
      title: t("productDescriptions.optimized.title"),
      description: t("productDescriptions.optimized.description"),
      imageUrl: KanbanImage,
    },
    {
      flag: t("productDescriptions.unlimited.flag"),
      title: t("productDescriptions.unlimited.title"),
      description: t("productDescriptions.unlimited.description"),
      imageUrl: LoginCardImage,
    },
  ];

  return (
    <section className="flex w-full flex-col items-center gap-14 bg-background">
      {productDescriptionInfo.map((item, index) => (
        <div
          key={`${item.flag}-${index}`}
          className={mergeTwClasses(
            index % 2 !== 0 ? "md:flex-row-reverse" : "md:flex-row",
            "flex flex-col gap-7 items-center md:justify-between max-w-7xl w-full md:px-2 px-4",
          )}
        >
          <div className="flex flex-col gap-2">
            <div className="flex flex-1 items-center gap-2">
              <TickCircle aria-hidden={true} className="size-5 text-cyan-6" />
              <p className="text-white text-medium leading-medium font-semibold">
                {item.flag}
              </p>
            </div>
            <h1 className="text-white font-bold">{item.title}</h1>
            <p className="text-large leading-large text-dark-2">
              {item.description}
            </p>
          </div>
          <img src={item.imageUrl.src} alt={item.title} width={IMAGE_WIDTH} />
        </div>
      ))}
    </section>
  );
};

export default ProductDescription;
