import {ChangeEvent, ComponentPropsWithRef, FC, forwardRef} from "react";
import {css} from "@emotion/react";

type Props = {
  handleChange: (value: number) => void
} & ComponentPropsWithRef<'input'>;

const inputStyles = css({
  paddingInline: 8,
  paddingBlock: 6,
  font: 'Inter',
  borderRadius: 8,
  border: 'none',
  width: '100%',
  background: 'black',
  textAlign: 'center',
  color: 'white',
  transition: 'all 0.4s ease-in-out',
  fontSize: 18,
  fontWeight: 700,
  ":disabled": {
    opacity: 0.5
  }
})
export const NumberInput: FC<Props> = forwardRef(({handleChange, ...props}, ref) => {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value)) return;
    handleChange(value);
  }
  return (<input type='number' onChange={onChange} css={inputStyles} ref={ref} {...props} />);
});
