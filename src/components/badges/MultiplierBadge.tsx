import {CSSProperties, FC} from "react";
import {css} from "@emotion/react";
import {BADGE_BLUE_COLOR, BADGE_INDIGO_COLOR, BADGE_PURPLE_COLOR, DARK_GRAY_COLOR} from "../../styles/colors.ts";

const badgeStyles = css({
  paddingInline: 11,
  paddingBlock: 2,
  background: DARK_GRAY_COLOR,
  borderRadius: 8,
  textAlign: 'center',
  color: 'purple',
  fontWeight: 700
})

type TBadgeProps = {
  multiplier: number
}

export const MultiplierBadge: FC<TBadgeProps> = ({multiplier}) => {
  const styles: CSSProperties = {
    color: multiplier < 2.5 ? BADGE_BLUE_COLOR : multiplier < 7 ? BADGE_PURPLE_COLOR: BADGE_INDIGO_COLOR,
  }
  return (
    <span style={styles} css={badgeStyles}>{multiplier}</span>
  )
}