import {ComponentProps, FC} from "react";
import {css} from "@emotion/react";
import Sidebar from "./Sidebar.tsx";
import Header from "./Header.tsx";
import BetsContainer from "./BetsContainer.tsx";
import BgImage from '../../assets/bg.jpg'
import {breakpoints, mq} from "../../styles/breakpoints.ts";

interface LayoutProps extends ComponentProps<"div"> {
  isAuthenticated?: boolean
}

const LayoutStyles = css({
  width: '100%',
  minHeight: '100vh',
  padding: 4,
  background: `url(${BgImage})`,
  backgroundSize: 'cover',
  display: 'flex',
  flexDirection: 'column',
  gap: 8
})

const ContainerStyles = css({
  width: '100%',
  height: '100%',
  padding: 4,
  [mq[0]]: {
    height: 'auto',
  }
})

const MainContainerStyles = css({
  display: 'grid',
  gridTemplateColumns: '9fr 3fr',
  gap: 4,
  minHeight: '100vh',
  [mq[0]]: {
    gridTemplateColumns: '1fr',
    minHeight: 'auto',
  }
})

const GameContainerStyles = css({
  width: '100%',
  height: '100%',
  display: 'grid',
  gap: 8,
  gridTemplateColumns: '1fr 2fr',
  [mq[0]]: {
    gridTemplateColumns: '1fr',
    gap: 0,
    height: 'auto',
  }
})

const Layout: FC<LayoutProps>  = ({children, ...props}) => {
  return (
    <div css={LayoutStyles} {...props}>
      <div css={MainContainerStyles}>
        <div css={ContainerStyles} >
          <Header />
          <div css={GameContainerStyles}>
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
