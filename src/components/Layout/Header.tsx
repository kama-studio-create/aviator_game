import {ComponentProps, FC} from "react";
import {css} from "@emotion/react";
import {TranscluscentBackgroundStyles} from "../../styles/common.ts";

const HeaderStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})
interface HeaderProps extends ComponentProps<'nav'> {

}
const Header: FC<HeaderProps> = ({...props}) => {
  return (
    <nav
      css={[HeaderStyles, TranscluscentBackgroundStyles]}
      {...props}
    >Header
    </nav>
  );
};
export default Header;
