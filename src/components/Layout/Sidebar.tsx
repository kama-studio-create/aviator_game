import {css} from "@emotion/react";
import {TranscluscentBackgroundStyles} from "../../styles/common.ts";

const SideBarStyles = css({
  width: '100%',
  height: '100%',

})
const Sidebar = () => {
  return (
    <div css={[SideBarStyles, TranscluscentBackgroundStyles]}>
     Sidebar
    </div>
  )
}

export default Sidebar
