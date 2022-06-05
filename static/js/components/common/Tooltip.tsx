import { FC, ReactNode, useState } from "react";
import { css } from "@emotion/react";

const TOOLTIP_STYLES = {
  "plusIcon": css({
    position: "absolute",
    textAlign: "center",
    bottom: 510,
    backgroundColor: "#000000",
    color: "#ffffff",
    borderRadius: 5,
    fontSize: 14,
    marginBottom: 5,
    paddingTop: 5,
    width: 110,
    height: 23,
    transform: "translateX(-40%)",
  }),
  "DL": css({
    position: "absolute",
    textAlign: "center",
    bottom: 510,
    backgroundColor: "#000000",
    color: "#ffffff",
    borderRadius: 5,
    fontSize: 14,
    whiteSpace: "pre-wrap",
    marginBottom: 5,
    paddingTop: 5,
    width: 84,
    height: 35,
    transform: "translateX(-30%)",
  }),
  "DC": css({
    position: "absolute",
    textAlign: "center",
    bottom: 510,
    backgroundColor: "#000000",
    color: "#ffffff",
    borderRadius: 5,
    fontSize: 14,
    whiteSpace: "pre-wrap",
    marginBottom: 5,
    paddingTop: 5,
    width: 114,
    height: 35,
    transform: "translateX(-48%)",
  }),
  "editIcon": css({
    position: "absolute",
    bottom: 40,
    textAlign: "center",
    backgroundColor: "#000000",
    color: "#ffffff",
    borderRadius: 5,
    paddingTop: 5,
    height: 25,
    width: 50,
    transform: "translateX(90%)",
  }),
  "trashIcon": css({
    position: "absolute",
    bottom: 40,
    textAlign: "center",
    backgroundColor: "#000000",
    color: "#ffffff",
    borderRadius: 5,
    paddingTop: 5,
    height: 25,
    width: 70,
    transform: "translateX(100%)",
  }),
};

const TOOLTIP_MSG = {
  "plusIcon": "Create todo",
  "DL": "Order by\nDeadline",
  "DC": "Order by\nDate Created",
  "editIcon": "Edit",
  "trashIcon": "Delete",
};

interface TooltipType {
  plusIcon: string;
  DL: string;
  DC: string;
  editIcon: string;
  trashIcon: string;
};

const Tooltip: FC<{
    children: ReactNode;
    tooltipType: keyof TooltipType;
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
        <p css={TOOLTIP_STYLES[tooltipType]}>
          {TOOLTIP_MSG[tooltipType]}
        </p>}
    </div>
  );
};

export default Tooltip;