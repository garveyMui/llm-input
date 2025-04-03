import type { Preview } from "@storybook/react";
import { MINIMAL_VIEWPORTS } from "@storybook/addon-viewport";
import "@/styles/tailwind.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        ...MINIMAL_VIEWPORTS,
        mobile1: {
          name: "iPhone 16 Pro",
          styles: {
            width: "1206px",
            height: "2622px",
          },
        },
        tablet: {
          name: "iPad",
          styles: {
            width: "2732px",
            height: "2048px",
          },
        },
        desktop: {
          name: "Mac",
          styles: {
            width: "2560px",
            height: "1664px",
          },
        },
      },
    },
  },
};

export default preview;
