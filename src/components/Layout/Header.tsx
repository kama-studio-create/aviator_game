import {ComponentProps, FC} from "react";
import {css} from "@emotion/react";
import {TranscluscentBackgroundStyles} from "../../styles/common.ts";
import {APP_NAME} from "../../common/strings.ts";
import {PillButton} from "../buttons/PillButton.tsx";

const HeaderStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBlock: 8,
  paddingInline: 16,
  marginBottom: '1rem'
})
const appNameStyles = css({
  fontSize: 14,
  fontWeight: 600
})
const logoFont = css({
  fontFamily: 'Courgette',
  fontSize: 24
})
const actionAreaStyles = css({
  display: 'flex',
  flexDirection: 'row',
  gap: 16,
  justifyContent: "flex-end",
  alignItems: 'center'
})
interface HeaderProps extends ComponentProps<'nav'> {

}
const Header: FC<HeaderProps> = ({...props}) => {
  return (
    <nav
      css={[HeaderStyles, TranscluscentBackgroundStyles]}
      {...props}
    >
      <p css={[appNameStyles, logoFont]}>{APP_NAME}</p>
      <div css={actionAreaStyles}>
        <p css={appNameStyles}>Ksh. 3000</p>
        <PillButton variant="success">Top Up</PillButton>
      </div>
    </nav>
  );
};
export default Header;
