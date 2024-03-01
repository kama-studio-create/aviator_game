import {ComponentProps, ComponentPropsWithRef, FC, forwardRef} from "react";
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
  width: '100%'
})
export const NumberInput: FC<Props> = forwardRef(({handleChange, ...props}, ref) => {
  return (
    <div>
      <input css={inputStyles} ref={ref} {...props} />
    </div>
  );
});
