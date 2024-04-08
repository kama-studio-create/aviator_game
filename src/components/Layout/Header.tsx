import {ComponentProps, FC} from "react";
import {css} from "@emotion/react";
import {translucentBackgroundStyles} from "../../styles/common.ts";
import {PillButton} from "../buttons/PillButton.tsx";
import {APP_NAME} from "../../common/constants.ts";

const styles = {
  headerStyles: css([{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBlock: 8,
    paddingInline: 16,
    marginBottom: '1rem'
  }, translucentBackgroundStyles]),
  appNameStyles: css({
    fontSize: 14,
    fontWeight: 600,
  }),
  actionAreaStyles: css({
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    justifyContent: "flex-end",
    alignItems: 'center'
  }),
}

const Header: FC<ComponentProps<'nav'>> = ({...props}) => {
  return (
    <nav
      css={styles.headerStyles}
      {...props}
    >
      <p css={styles.appNameStyles} style={{fontSize: 20, fontFamily: 'Courgette'}}>{APP_NAME}</p>
      <div css={styles.actionAreaStyles}>
        <p css={styles.appNameStyles}>Ksh. 3000</p>
        <PillButton variant="success">Top Up</PillButton>
      </div>
    </nav>
  );
};
export default Header;
