import {ComponentProps, FC} from "react";
import {css} from "@emotion/react";
import Sidebar from "./Sidebar.tsx";
import Header from "./Header.tsx";
import BetsContainer from "./BetsContainer.tsx";
import BgImage from '../../assets/bg.jpg'
import {breakpoints, mq} from "../../styles/breakpoints.ts";
import {TranscluscentBackgroundStyles} from "../../styles/common.ts";

interface LayoutProps extends ComponentProps<"div"> {
  isAuthenticated?: boolean
}

const styles = {
  layoutStyles : css({
    width: '100%',
    minHeight: '100vh',
    padding: 4,
    background: `url(${BgImage})`,
    backgroundSize: 'cover',
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  }),
  containerStyles : css({
    width: '100%',
    height: '100%',
    padding: 4,
  }),
  mainContainerStyles : css({
    display: 'grid',
    gridTemplateColumns: '9fr 3fr',
    gap: 4,
    minHeight: '100vh',
    [mq[0]]: {
      gridTemplateColumns: '1fr',
      minHeight: 'auto',
    }
  }),
  gameContainerStyles : css([{
    width: '100%',
    height: '100%',
    display: 'grid',
    gap: 8,
    gridTemplateColumns: '1fr 2fr',
    [mq[0]]: {
      gridTemplateColumns: '1fr',
      gap: 0,
      height: 'auto',
    },
  }, TranscluscentBackgroundStyles])
}


const Layout: FC<LayoutProps>  = ({children, ...props}) => {
  return (
    <div css={styles.layoutStyles} {...props}>
      <div css={styles.mainContainerStyles}>
        <div css={styles.containerStyles} >
          <Header />
          <div css={styles.gameContainerStyles}>
            {window.innerWidth > breakpoints[0] && <BetsContainer/>}
            {children}
          </div>
        </div>
        <Sidebar />
      </div>
    </div>
  )
}

export default Layout
