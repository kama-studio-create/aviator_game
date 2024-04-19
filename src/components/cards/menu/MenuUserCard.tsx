import {FC} from "react";
import {css} from "@emotion/react";
import {rowStyles} from "../../../styles/common.ts";
import {LIGHT_GRAY_COLOR, WHITE_COLOR} from "../../../styles/colors.ts";
import {useAvatar} from "../../../hooks/useAvatar.ts";
import {censor} from "../../../utils/censor.ts";

import iconAvatar from "../../../assets/icons/avatar.svg";

const cardStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  padding: 8,
  '& .avatar': {
    width: 36,
    height: 36,
    backgroundColor: WHITE_COLOR,
    borderRadius: '50%',
    border: `2px solid ${LIGHT_GRAY_COLOR}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    img: {
      width: 32,
      height: 32,
      borderRadius: '50%'
    }
  },
  h1: {
    fontSize: 16,
  },
  button: {
    background: '#252528',
    paddingInline: 16,
    display: 'grid',
    gridTemplateColumns: 'repeat(2,1fr)',
    maxWidth: 100,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    border: `1px solid ${LIGHT_GRAY_COLOR}`,
    borderRadius: 24,
    a: {
      opacity: 0.5,
      fontSize: 12,
      fontWeight: 400
    },
    img : {
      width: 20,
      height: 20
    }
  }
})


type props = {
  username: string
}

export const MenuUserCard: FC<props> = ({username}) => {
  const {assignAvatar} = useAvatar();
  return (
    <div css={cardStyles}>
      <div style={{gap: 8}} css={rowStyles}>
        <div className='avatar'>
          <img src={assignAvatar(username)} alt=''/>
        </div>
        <h1>{censor(username)}</h1>
      </div>
      <button>
        <img src={iconAvatar} alt='avatar'/>
        <a>Change avatar</a>
      </button>
    </div>
  )
}