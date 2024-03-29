/*
 * リセットcss, 全フォント共通のスタイル
 */
import { css, Global } from "@emotion/react";
import emotionReset from "emotion-reset";

const reset = css(emotionReset);

const font = css({
  "p, a, h1, h2, h3, h4, label": {
    fontFamily: "Arial Black",
    color: "#000000",
  },
});

function GlobalStyles() {
  return <Global styles={[reset, font]} />;
}

export default GlobalStyles;
