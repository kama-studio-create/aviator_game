import { ComponentProps, FC } from "react";
import { css } from "@emotion/react";
import Sidebar from "./Sidebar.tsx";
import Header from "./Header.tsx";
import { MEDIA_QUERIES } from "../../styles/breakpoints.ts";
import { DARK_GRAY_COLOR } from "../../styles/colors.ts";

interface LayoutProps extends ComponentProps<"div"> {
  isAuthenticated?: boolean;
}

const styles = {
  layoutStyles: css({
    width: "100%",
    minHeight: "100vh",
    background: DARK_GRAY_COLOR,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    fontFamily: "Inter, sans-serif",
  }),
  containerStyles: css({
    width: "100%",
    height: "100%",
  }),
  mainContainerStyles: css({
    display: "grid",
    gridTemplateColumns: "8fr 4fr",
    gap: 4,
    minHeight: "100vh",
    [MEDIA_QUERIES[0]]: {
      gridTemplateColumns: "1fr",
      minHeight: "auto",
    },
  }),
  gameContainerStyles: css({
    width: "100%",
    height: "100%",
    display: "grid",
    gap: 8,
    [MEDIA_QUERIES[0]]: {
      gridTemplateColumns: "1fr",
      gap: 8,
      height: "auto",
    },
  }),
};

const Layout: FC<LayoutProps> = ({ children, ...props }) => {
  return (
    <div css={styles.layoutStyles} {...props}>
      <div css={styles.mainContainerStyles}>
        <div css={styles.containerStyles}>
          <Header />
          <div css={styles.gameContainerStyles}>{children}</div>
        </div>
        <Sidebar />
      </div>
    </div>
  );
};

export default Layout;
