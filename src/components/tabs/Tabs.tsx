import {ComponentProps, FC, ReactNode, useState} from "react";
import {css} from "@emotion/react";
import {DARK_GRAY_COLOR, LIGHT_GRAY_COLOR, WHITE_COLOR} from "../../styles/colors.ts";

const mainContainer = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 4
})

const tabContainer = css({
  display: 'flex',
  flexDirection: 'row',
  width: '70%',
  maxWidth: 400,
  padding: 2,
  backgroundColor: '#141516',
  borderRadius: 16,
  marginInline: 'auto',
  transition: 'all 0.6s ease-in-out'
})
const tabStyles = css({
  width: '100%',
  padding: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  flex: 1,
  backgroundColor: DARK_GRAY_COLOR,
  borderRadius: 16,
  textAlign: 'center',
  fontSize: 12,
  color: '#9ea0a3',
  '&.active': {
    backgroundColor: LIGHT_GRAY_COLOR,
    border: `1px solid ${DARK_GRAY_COLOR}`,
    opacity: 1,
    color: WHITE_COLOR
  },
  transition: 'background-color 0.2s ease-in-out'

})

const childContainer = css({
  width: '100%',

})

export type Tab = {
  label: string;
  component: ReactNode
}

type props = {
  tabs: Tab[]
} & ComponentProps<'div'>

export const Tabs: FC<props> = ({tabs}) => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const setTabAsActive = (i: number) => {
    setCurrentTabIndex(i);
  }

  return (
    <div css={mainContainer}>
      <div css={tabContainer}>
        {tabs.map((tab, index) => (
          <div
            className={currentTabIndex === index ? 'active' : ''}
            key={tab.label}
            css={tabStyles}
            onClick={() => {
              setTabAsActive(index)
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div css={childContainer}>
        {tabs[currentTabIndex] && tabs[currentTabIndex].component}
      </div>
    </div>
  )
}