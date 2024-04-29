import { ComponentProps, FC, ReactNode, useState } from "react";
import { css } from "@emotion/react";
import { TabItem } from "./TabItem.tsx";

const mainContainer = css({
  display: "flex",
  flexDirection: "column",
  gap: 4,
});

const tabContainer = css({
  display: "flex",
  flexDirection: "row",
  width: "70%",
  maxWidth: 400,
  padding: 2,
  backgroundColor: "#141516",
  borderRadius: 16,
  marginInline: "auto",
  transition: "all 0.6s ease-in-out",
});


const childContainer = css({
  width: "100%",
  transition: "all 0.4s ease-in-out",
});

export type Tab = {
  label: string;
  component: ReactNode;
};

type props = {
  tabs: Tab[];
} & ComponentProps<"div">;

export const Tabs: FC<props> = ({ tabs }) => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const setTabAsActive = (i: number) => {
    setCurrentTabIndex(i);
  };

  return (
    <div css={mainContainer}>
      <div css={tabContainer}>
        {tabs.map((tab, index) => (
          <TabItem
            isActive={index === currentTabIndex}
            key={tab.label}
            onClick={() => {
              setTabAsActive(index);
            }}
          >
            {tab.label}
          </TabItem>
        ))}
      </div>
      <div css={childContainer}>
        {tabs[currentTabIndex] && tabs[currentTabIndex].component}
      </div>
    </div>
  );
};
