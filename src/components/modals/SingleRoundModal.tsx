import {FC} from "react";
import {css, keyframes} from "@emotion/react";
import {rowStyles} from "../../styles/common.ts";
import {MultiplierBadge} from "../badges/MultiplierBadge.tsx";
import {DARK_GRAY_COLOR, ERROR_COLOR, GRAY_COLOR, HEADER_COLOR} from "../../styles/colors.ts";

import iconClose from "../../assets/icons/close.svg";
import iconServer from "../../assets/icons/server.svg";
import iconClient from "../../assets/icons/client.svg";
import iconHash from "../../assets/icons/hash.svg";

import {censor} from "../../utils/censor.ts";

const slideIn = keyframes({
  "0%": {
    opacity: 0,
    transform: 'translateY(-100%)',
  },
  "100%": {
    opacity: 1,
    transform: 'translateY(0)',
  },
});

const modalStyles = css({
  position: 'fixed',
  top: -40,
  left: 0,
  width: '100%',
  height: 'auto',
  zIndex: 103,
  overflowX: 'scroll',
  backgroundColor: GRAY_COLOR,
  borderRadius: 16,
  transition: 'all 0.3s ease-in-out',
  animation: `${slideIn} 0.3s ease-in-out`,
})

const headerStyles = css({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  padding: 8,
  background: '#2c2d30',
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
  backgroundColor: HEADER_COLOR,
  marginBottom: 8,
  h1: {
    color: 'white',
    fontSize: 16,
    fontWeight: 400,
    textTransform: 'uppercase'
  },
  button: {
    background: 'transparent',
    border: 'none',
    width: 24,
    height: 24,
    cursor: 'pointer',
    img: {
      width: 20,
      height: 20
    }
  },

})

const footerStyles = css({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  padding: 16,
  background: '#2c2d30',
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
  marginTop: 16,
  p : {
    color: '6f7072',
    fontSize: 15,
    fontWeight: 400,
    opacity: 0.7,
    textAlign: "center",
    span: {
      color: ERROR_COLOR
    }
  }
})

const bodyStyles = css({
  paddingBlock: 8,
  paddingInline: 16,
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
  h1: {
    fontSize: 15,
    lineHeight: 1,
    fontWeight: 500,
    textTransform: 'capitalize'
  },
  p: {
    fontSize: 14,
    opacity: 0.6
  }
})

const selectContainer = css({
  display: 'grid',
  placeContent: 'center',
  backgroundColor: DARK_GRAY_COLOR,
  fontSize: 14,
  padding: 16,
  marginBlock: 4,
  borderRadius: 8,
  fontWeight: 500,
  gap: 4,
  overflow: "hidden"
})

type props = {
  multiplier: number,
  close: () => void
}

export const SingleRoundModal: FC<props> = ({multiplier, close}) => {
  return (
    <div css={modalStyles}>
      <div css={headerStyles}>
        <div style={{gap: 8, alignItems: 'center'}} css={rowStyles}>
          <h1>ROUND 19828277888</h1>
          <MultiplierBadge onClick={() => {}} multiplier={multiplier}/>
          <h1>14:14:21</h1>
        </div>
        <button onClick={close}>
          <img src={iconClose} alt="close"/>
        </button>
      </div>
      <div css={bodyStyles}>
        <div style={{gap: 8}} css={rowStyles}>
          <img src={iconServer} alt="server"/>
          <div>
            <h1>Server Seed:</h1>
            <p>Generated on our side</p>
          </div>
        </div>
        <div css={selectContainer}>
          zgln5ZYqcyShXUGF8OKg5LYENwTyl6oQ9jDZS7bR
        </div>
      </div>
      <div css={bodyStyles}>
        <div style={{gap: 8}} css={rowStyles}>
          <img src={iconClient} alt="server"/>
          <div>
            <h1>Client Seed:</h1>
            <p>Generated on players side</p>
          </div>
        </div>
        <div style={{padding: 8}} css={selectContainer}>
          <div style={{justifyContent: "center"}} css={rowStyles}>
            <p>Player N1:</p>
            <div style={{width: 24, height: 24, borderRadius: 12, backgroundColor: 'white'}}/>
            <h3>{censor('zulululu')}</h3>
          </div>
          <div style={{justifyContent: "center"}} css={rowStyles}>
            <p>Seed:</p>yl6oQ9jDZS7bR
          </div>
        </div>
        <div style={{padding: 8}} css={selectContainer}>
          <div style={{justifyContent: "center"}} css={rowStyles}>
            <p>Player N1:</p>
            <div style={{width: 24, height: 24, borderRadius: 12, backgroundColor: 'white'}}/>
            <h3>{censor('zulululu')}</h3>
          </div>
          <div style={{justifyContent: "center"}} css={rowStyles}>
            <p>Seed:</p>yl6oQ9jDZS7bR
          </div>
        </div>
        <div style={{padding: 8}} css={selectContainer}>
          <div style={{justifyContent: "center"}} css={rowStyles}>
            <p>Player N1:</p>
            <div style={{width: 24, height: 24, borderRadius: 12, backgroundColor: 'white'}}/>
            <h3>{censor('zulululu')}</h3>
          </div>
          <div style={{justifyContent: "center"}} css={rowStyles}>
            <p>Seed:</p>yl6oQ9jDZS7bR
          </div>
        </div>
      </div>
      <div css={bodyStyles}>
        <div style={{gap: 8}} css={rowStyles}>
          <img src={iconHash} alt="server"/>
          <div>
            <h1>Combined SHA512 Hash:</h1>
            <p>Above seeds combined and converted to SHA512 Hash. This is your game result</p>
          </div>
        </div>
        <div css={selectContainer}>
          272c759cfc8dd42c7759b5fa5db642278b92d7ffb81fa5
        </div>
      </div>
      <div style={{textAlign: "center", paddingBlock: 0}} css={bodyStyles}>
        <p>Hex:</p>
        <div css={selectContainer}>
          272c759cfc8dd42c7759b5fa5d
        </div>
      </div>
      <div style={{textAlign: "center", paddingBlock: 0}} css={bodyStyles}>
        <p>Decimal:</p>
        <div css={selectContainer}>
          672228827272772728
        </div>
      </div>
      <div style={{textAlign: "center", paddingBlock: 0}} css={bodyStyles}>
        <p>Result:</p>
        <div css={selectContainer}>
          23.01x
        </div>
      </div>
      <div css={footerStyles}>
        <p>For instructions check <span>What is Provably Fair</span></p>
      </div>
    </div>
  )
}