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
  color: 'white'
})
export const NumberInput: FC<Props> = forwardRef(({handleChange, ...props}, ref) => {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value)) return;
    handleChange(value);
  }
  return (<input onChange={onChange} css={inputStyles} ref={ref} {...props} />);
});
