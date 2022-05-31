import { FC, ReactNode, useState } from "react";
import { css } from "@emotion/react";

const tooltipStylesCommon = css({
  position: "absolute",
  textAlign: "center",
  bottom: 420,
  backgroundColor: "#000000",
  color: "#ffffff",
  borderRadius: 5,
  fontSize: 14,
  whiteSpace: "pre-wrap",
  marginBottom: 5,
  paddingTop: 5,
  "&::after": {
    /*
     * TODO! tooltipにした方向しっぽをつけたい
     * contentを指定するとなにもレンダリングされなくなる
     */
  }
});

const TOOLTIP_STYLES = {
  "plusIcon": css({
    width: 110,
    height: 23,
    transform: "translateX(-40%)",
  }),
  "DL": css({
    width: 84,
    height: 35,
    transform: "translateX(-30%)",
  }),
  "DC": css({
    width: 114,
    height: 35,
    transform: "translateX(-48%)",
  })
};

const TOOLTIP_MSG = {
  "plusIcon": "Create todo",
  "DL": "Order by\nDeadline",
  "DC": "Order by\nDate Created"
};

interface TooltopType {
  plusIcon: string;
  DL: string;
  DC: string;
};

const Tooltip: FC<{
    children: ReactNode;
    tooltipType: keyof TooltopType;
  }> = ({
    children,
    tooltipType
  }) => {

  const [isShowTooltip, setIsTooltip] = useState(false);

  return (
    <div>
      <div 
        onMouseEnter={() => {setIsTooltip(true)}}
        onMouseLeave={() => {setIsTooltip(false)}}>
        {children}
      </div>
      {isShowTooltip && 
        <p css={[tooltipStylesCommon, TOOLTIP_STYLES[tooltipType]]}>
          {TOOLTIP_MSG[tooltipType]}
        </p>}
    </div>
  );
};

export default Tooltip;