import {css} from "@emotion/react";
import {TranscluscentBackgroundStyles} from "../../styles/common.ts";

const sideBarStyles = css([{
  width: '100%',
  height: '100%',

}, TranscluscentBackgroundStyles])
const Sidebar = () => {
  return (
    <div css={sideBarStyles}>
     Sidebar
    </div>
  )
}

export default Sidebar
