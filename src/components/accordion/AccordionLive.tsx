import { type Brand } from '../../data/tokens';

export type AccordionStyle = 'Full Border' | 'Bottom Border' | 'GPay' | 'ApplePay' | 'PayPal';
export type AccordionState = 'Default' | 'Hover' | 'Focus' | 'Disabled';

interface AccordionLiveProps {
  style?: AccordionStyle;
  state?: AccordionState;
  opened?: boolean;
  backgroundFill?: boolean;
  showIconLeft?: boolean;
  showCountryFlag?: boolean;
  titleText?: string;
  showSubtitle?: boolean;
  subtitleText?: string;
  showBadge?: boolean;
  showContent?: boolean;
  contentText?: string;
  brand?: Brand;
}

/* ── Inline SVG helpers — exact Figma export paths ─────────────────────────── */

/** Placeholder icon — diagonal-split square, 16×16 filled path from Figma */
function PlaceholderIcon({ color }: { color: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="17.999 19.9999 16.001 16.0001"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32.665 19.9999C33.0187 19.9999 33.3584 20.1405 33.6084 20.3905C33.8584 20.6405 33.999 20.9803 33.999 21.3339V34.6669C33.999 35.0203 33.8583 35.3593 33.6084 35.6093C33.3584 35.8593 33.0187 35.9999 32.665 35.9999H19.332C18.9784 35.9999 18.6397 35.8593 18.3896 35.6093C18.1396 35.3592 17.9991 35.0204 17.999 34.6669V21.3339C17.999 20.9802 18.1396 20.6406 18.3896 20.3905C18.6397 20.1406 18.9785 19.9999 19.332 19.9999H32.665ZM19.332 34.6669H31.7227L19.332 22.2762V34.6669ZM20.2744 21.3339L32.665 33.7255V21.3339H20.2744Z"
        fill={color}
      />
    </svg>
  );
}

/** Chevron down (closed) — exact Figma filled path, ~15×8 */
function ChevronDown({ color }: { color: string }) {
  return (
    <svg
      width="15"
      height="9"
      viewBox="374.6 22.6 14.8 8.2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M388.194 22.8624C388.454 22.602 388.877 22.602 389.137 22.8624C389.397 23.1227 389.397 23.5445 389.137 23.8047L382.47 30.4717C382.21 30.7319 381.788 30.7318 381.528 30.4717L374.861 23.8047C374.6 23.5444 374.6 23.1227 374.861 22.8624C375.121 22.602 375.543 22.6021 375.803 22.8624L381.998 29.0577L388.194 22.8624Z"
        fill={color}
      />
    </svg>
  );
}

/** Chevron up (opened) — exact Figma filled path */
function ChevronUp({ color }: { color: string }) {
  return (
    <svg
      width="15"
      height="9"
      viewBox="375.267 24.5 13.5 8.5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M381.578 24.7512C381.84 24.5113 382.226 24.5287 382.47 24.8029L388.47 31.5529L388.516 31.6096C388.729 31.9041 388.714 32.3389 388.47 32.6135C388.226 32.888 387.84 32.9053 387.578 32.6652L387.527 32.6135L381.999 26.3937L376.47 32.6135C376.209 32.9063 375.788 32.9063 375.527 32.6135C375.267 32.3206 375.267 31.8458 375.527 31.5529L381.527 24.8029L381.578 24.7512Z"
        fill={color}
      />
    </svg>
  );
}

/** Google Pay icon — 64×40 from Atom.zip */
function GooglePayIcon() {
  return (
    <svg width="64" height="40" viewBox="0 0 64 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="63.9943" height="40" fill="white" />
      <g clipPath="url(#gpay-clip)">
        <path d="M30.7375 20.3725V25.6982H29.0195V12.5271H33.4862C34.5743 12.5271 35.6051 12.928 36.4068 13.6725C37.2085 14.3596 37.6094 15.3904 37.6094 16.4785C37.6094 17.5665 37.2085 18.54 36.4068 19.2845C35.6051 20.0289 34.6315 20.4298 33.4862 20.4298L30.7375 20.3725ZM30.7375 14.1306V18.7118H33.6008C34.2307 18.7118 34.8606 18.4828 35.2615 18.0246C36.1777 17.1657 36.1777 15.734 35.3187 14.875L35.2615 14.8178C34.8033 14.3596 34.2307 14.0733 33.6008 14.1306H30.7375Z" fill="#5F6368" />
        <path d="M41.5607 16.4212C42.8205 16.4212 43.794 16.7648 44.5385 17.452C45.2829 18.1392 45.6265 19.0554 45.6265 20.2007V25.6982H44.0231V24.4384H43.9658C43.2786 25.4692 42.3051 25.9846 41.1598 25.9846C40.1863 25.9846 39.3273 25.6982 38.6401 25.1256C38.0102 24.5529 37.6094 23.7512 37.6094 22.8922C37.6094 21.976 37.9529 21.2315 38.6401 20.6589C39.3273 20.0862 40.3008 19.8571 41.4461 19.8571C42.4769 19.8571 43.2786 20.0289 43.9086 20.4298V20.0289C43.9086 19.4563 43.6795 18.8836 43.2214 18.54C42.7633 18.1392 42.1906 17.9101 41.5607 17.9101C40.5872 17.9101 39.8427 18.311 39.3273 19.1127L37.8384 18.1964C38.7547 16.9939 39.9572 16.4212 41.5607 16.4212ZM39.3846 22.9495C39.3846 23.4076 39.6137 23.8085 39.9572 24.0375C40.3581 24.3239 40.8162 24.4957 41.2744 24.4957C41.9615 24.4957 42.6487 24.2093 43.1641 23.6939C43.7368 23.1785 44.0231 22.5486 44.0231 21.8614C43.5077 21.4606 42.7633 21.2315 41.7897 21.2315C41.1026 21.2315 40.5299 21.4033 40.0718 21.7469C39.6136 22.0332 39.3846 22.4341 39.3846 22.9495Z" fill="#5F6368" />
        <path d="M54.9036 16.7075L49.2343 29.7068H47.5163L49.6351 25.1828L45.9129 16.7648H47.7454L50.4368 23.2358H50.4941L53.1283 16.7648H54.9036V16.7075Z" fill="#5F6368" />
        <path d="M23.9229 19.2272C23.9229 18.7118 23.8656 18.1964 23.8084 17.681H16.6502V20.6016H20.716C20.5442 21.5178 20.0288 22.3768 19.2271 22.8922V24.782H21.6895C23.1212 23.4649 23.9229 21.5178 23.9229 19.2272Z" fill="#4285F4" />
        <path d="M16.6502 26.6145C18.7117 26.6145 20.4297 25.9273 21.6895 24.782L19.2271 22.8922C18.5399 23.3503 17.6809 23.6367 16.6502 23.6367C14.7031 23.6367 12.9852 22.3196 12.4125 20.4871H9.89282V22.4341C11.2099 25.011 13.7869 26.6145 16.6502 26.6145Z" fill="#34A853" />
        <path d="M12.4125 20.4871C12.0689 19.5708 12.0689 18.54 12.4125 17.5665V15.6195H9.89282C8.80477 17.7383 8.80477 20.258 9.89282 22.4341L12.4125 20.4871Z" fill="#FBBC04" />
        <path d="M16.6502 14.4742C17.7382 14.4742 18.769 14.875 19.5707 15.6195L21.7468 13.4434C20.3724 12.1836 18.5399 11.4391 16.7074 11.4964C13.8441 11.4964 11.2099 13.0998 9.95008 15.6768L12.4698 17.6238C12.9852 15.7913 14.7031 14.4742 16.6502 14.4742Z" fill="#EA4335" />
      </g>
      <defs>
        <clipPath id="gpay-clip">
          <rect width="45.8125" height="21.8182" fill="white" transform="translate(9.09094 9.09094)" />
        </clipPath>
      </defs>
    </svg>
  );
}

/** Apple Pay icon — 70×40 from Atom.zip */
function ApplePayIcon() {
  return (
    <svg width="70" height="40" viewBox="0 0 70 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="69.4572" height="40" fill="white" />
      <path d="M18.818 11.9034C19.4146 11.1364 19.8408 10.1137 19.7129 9.09094C18.818 9.13356 17.7527 9.68753 17.1135 10.412C16.5595 11.0512 16.0482 12.1165 16.176 13.0966C17.1987 13.2245 18.1788 12.6705 18.818 11.9034ZM19.7129 13.3523C18.2641 13.2671 17.0283 14.162 16.3465 14.162C15.6646 14.162 14.5993 13.3949 13.4487 13.3949C11.9572 13.4375 10.5936 14.2472 9.82656 15.6108C8.29247 18.2955 9.40043 22.2586 10.9345 24.4319C11.659 25.4972 12.5538 26.6904 13.7044 26.6478C14.8124 26.6051 15.2385 25.9233 16.5595 25.9233C17.8805 25.9233 18.2641 26.6478 19.4572 26.6051C20.6504 26.5625 21.4175 25.5398 22.1419 24.4319C22.9942 23.1961 23.3351 22.0029 23.3351 21.9603C23.2925 21.9176 20.9913 21.0654 20.9913 18.4233C20.9487 16.2074 22.7811 15.1421 22.8663 15.0995C21.8862 13.5654 20.2669 13.3949 19.7129 13.3523Z" fill="black" />
      <path d="M32.2413 10.3267C35.3948 10.3267 37.568 12.5 37.568 15.6108C37.568 18.7642 35.3521 20.9375 32.1561 20.9375H28.7044V26.4347H26.1902V10.3267H32.2413ZM31.5595 18.8495C33.7328 18.8495 34.9686 17.6563 34.9686 15.6534C34.9686 13.608 33.7328 12.4574 31.5595 12.4574H28.6618V18.8495H31.5595ZM38.2073 23.1534C38.2073 21.108 39.784 19.8296 42.5965 19.6591L45.8351 19.4887V18.5938C45.8351 17.2728 44.9402 16.5057 43.4913 16.5057C42.0851 16.5057 41.2328 17.1875 41.0198 18.2103H38.7186C38.8465 16.0796 40.6788 14.5029 43.5766 14.5029C46.4317 14.5029 48.2641 15.9944 48.2641 18.3807V26.4773H45.9629V24.5597H45.9203C45.2385 25.8807 43.747 26.6904 42.2129 26.6904C39.8266 26.6904 38.2073 25.2415 38.2073 23.1534ZM45.8351 22.0881V21.1506L42.9374 21.3211C41.4885 21.4063 40.6788 22.0455 40.6788 23.0682C40.6788 24.0909 41.5311 24.7728 42.8095 24.7728C44.5141 24.7728 45.8351 23.6222 45.8351 22.0881ZM50.3948 30.8239V28.8637C50.5652 28.9063 50.9913 28.9063 51.1618 28.9063C52.2698 28.9063 52.8663 28.4375 53.2499 27.2443C53.2499 27.2017 53.4629 26.5199 53.4629 26.5199L49.2016 14.7586H51.801L54.784 24.3466H54.8266L57.8095 14.7586H60.3663L55.9771 27.1591C54.9544 30.0142 53.8038 30.9091 51.3749 30.9091C51.2044 30.8665 50.6078 30.8665 50.3948 30.8239Z" fill="black" />
    </svg>
  );
}

/** PayPal icon — 108×40 from Atom.zip */
function PayPalIcon() {
  return (
    <svg width="108" height="40" viewBox="0 0 108 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="107.533" height="40" fill="white" />
      <path d="M42.5007 13.9704H37.5562C37.2179 13.9704 36.9301 14.2162 36.8773 14.5502L34.8776 27.2291C34.8378 27.4793 35.0316 27.7049 35.2853 27.7049H37.6459C37.9842 27.7049 38.272 27.459 38.3248 27.1243L38.8641 23.7046C38.9162 23.3699 39.2046 23.124 39.5423 23.124H41.1075C44.3646 23.124 46.2443 21.5479 46.7352 18.4247C46.9565 17.0582 46.7446 15.9846 46.1048 15.2327C45.402 14.407 44.1556 13.9704 42.5007 13.9704ZM43.0711 18.6011C42.8008 20.3753 41.4452 20.3753 40.1344 20.3753H39.3883L39.9117 17.0618C39.9428 16.8616 40.1163 16.7141 40.3188 16.7141H40.6607C41.5536 16.7141 42.3959 16.7141 42.8311 17.2231C43.0907 17.5267 43.1702 17.9778 43.0711 18.6011Z" fill="#253B80" />
      <path d="M57.2807 18.5439H54.9129C54.7112 18.5439 54.5369 18.6914 54.5058 18.8917L54.401 19.554L54.2355 19.3139C53.7229 18.57 52.5798 18.3213 51.439 18.3213C48.8225 18.3213 46.5877 20.303 46.1525 23.0828C45.9262 24.4695 46.2479 25.7955 47.0345 26.7202C47.7561 27.5704 48.7885 27.9246 50.0168 27.9246C52.1251 27.9246 53.2941 26.5691 53.2941 26.5691L53.1886 27.227C53.1488 27.4786 53.3426 27.7041 53.5949 27.7041H55.7277C56.0668 27.7041 56.3531 27.4583 56.4066 27.1236L57.6862 19.0197C57.7267 18.7702 57.5337 18.5439 57.2807 18.5439ZM53.9802 23.1522C53.7518 24.5049 52.6781 25.413 51.3088 25.413C50.6213 25.413 50.0718 25.1925 49.719 24.7746C49.3691 24.3596 49.236 23.7689 49.3474 23.111C49.5606 21.7699 50.6523 20.8322 52.0007 20.8322C52.6731 20.8322 53.2197 21.0556 53.5797 21.4771C53.9405 21.9029 54.0836 22.4972 53.9802 23.1522Z" fill="#253B80" />
      <path d="M69.8909 18.5439H67.5116C67.2846 18.5439 67.0713 18.6567 66.9426 18.8454L63.661 23.6793L62.27 19.0341C62.1825 18.7435 61.9143 18.5439 61.6106 18.5439H59.2725C58.9883 18.5439 58.791 18.8216 58.8813 19.0891L61.5022 26.7802L59.0382 30.2584C58.8445 30.5324 59.0397 30.9091 59.3744 30.9091H61.7509C61.9764 30.9091 62.1875 30.7992 62.3155 30.6141L70.2293 19.191C70.4187 18.9177 70.2242 18.5439 69.8909 18.5439Z" fill="#253B80" />
      <path d="M77.7685 13.9704H72.8233C72.4857 13.9704 72.198 14.2162 72.1452 14.5502L70.1454 27.2291C70.1057 27.4793 70.2994 27.7049 70.5517 27.7049H73.0894C73.3251 27.7049 73.5268 27.5328 73.5637 27.2985L74.1312 23.7046C74.1833 23.3699 74.4717 23.124 74.8094 23.124H76.3739C79.6317 23.124 81.5107 21.5479 82.0023 18.4247C82.2243 17.0582 82.011 15.9846 81.3712 15.2327C80.6692 14.407 79.4235 13.9704 77.7685 13.9704ZM78.339 18.6011C78.0693 20.3753 76.7137 20.3753 75.4022 20.3753H74.6568L75.181 17.0618C75.2121 16.8616 75.3842 16.7141 75.5873 16.7141H75.9293C76.8214 16.7141 77.6644 16.7141 78.0997 17.2231C78.3592 17.5267 78.438 17.9778 78.339 18.6011Z" fill="#179BD7" />
      <path d="M92.5478 18.5439H90.1814C89.9783 18.5439 89.8055 18.6914 89.7751 18.8917L89.6703 19.554L89.504 19.3139C88.9914 18.57 87.8491 18.3213 86.7082 18.3213C84.0918 18.3213 81.8577 20.303 81.4225 23.0828C81.1969 24.4695 81.5172 25.7955 82.3038 26.7202C83.0268 27.5704 84.0578 27.9246 85.2861 27.9246C87.3943 27.9246 88.5634 26.5691 88.5634 26.5691L88.4579 27.227C88.4181 27.4786 88.6119 27.7041 88.8656 27.7041H90.9977C91.3353 27.7041 91.6231 27.4583 91.6758 27.1236L92.9563 19.0197C92.9953 18.7702 92.8015 18.5439 92.5478 18.5439ZM89.2474 23.1522C89.0203 24.5049 87.9453 25.413 86.5759 25.413C85.8898 25.413 85.3389 25.1925 84.9861 24.7746C84.6362 24.3596 84.5046 23.7689 84.6145 23.111C84.8292 21.7699 85.9195 20.8322 87.2678 20.8322C87.9402 20.8322 88.4868 21.0556 88.8468 21.4771C89.209 21.9029 89.3522 22.4972 89.2474 23.1522Z" fill="#179BD7" />
      <path d="M95.3392 14.3181L93.3098 27.2291C93.27 27.4793 93.4638 27.7049 93.7161 27.7049H95.7564C96.0954 27.7049 96.3832 27.459 96.4352 27.1243L98.4365 14.4461C98.4762 14.1959 98.2825 13.9696 98.0301 13.9696H95.7455C95.5438 13.9704 95.3703 14.1178 95.3392 14.3181Z" fill="#179BD7" />
      <path d="M14.3441 30.1688L14.7223 27.767L13.88 27.7475H9.85803L12.6531 10.025C12.6618 9.97154 12.69 9.92165 12.7312 9.88622C12.7724 9.8508 12.8252 9.83128 12.8801 9.83128H19.6617C21.913 9.83128 23.4667 10.2998 24.2779 11.2245C24.6582 11.6583 24.9004 12.1116 25.0175 12.6104C25.1404 13.1339 25.1426 13.7592 25.0226 14.522L25.0139 14.5777V15.0664L25.3942 15.2818C25.7145 15.4517 25.969 15.6462 26.1642 15.8689C26.4895 16.2398 26.6999 16.7112 26.7888 17.27C26.8807 17.8448 26.8503 18.5288 26.6999 19.3031C26.5264 20.1938 26.2459 20.9696 25.867 21.6043C25.5186 22.1892 25.0747 22.6743 24.5476 23.0503C24.0444 23.4075 23.4465 23.6786 22.7705 23.8521C22.1155 24.0227 21.3686 24.1087 20.5495 24.1087H20.0217C19.6443 24.1087 19.2778 24.2447 18.99 24.4883C18.7016 24.737 18.5107 25.0768 18.4521 25.4484L18.4124 25.6646L17.7443 29.8977L17.714 30.0531C17.706 30.1023 17.6923 30.1269 17.672 30.1435C17.654 30.1587 17.6279 30.1688 17.6026 30.1688H14.3441Z" fill="#253B80" />
      <path d="M25.7543 14.6341C25.734 14.7635 25.7109 14.8958 25.6848 15.0317C24.7905 19.6234 21.7309 21.2096 17.8231 21.2096H15.8335C15.3556 21.2096 14.9529 21.5566 14.8784 22.028L13.8597 28.4886L13.5713 30.3199C13.5228 30.6293 13.7614 30.9084 14.0737 30.9084H17.6026C18.0205 30.9084 18.3755 30.6047 18.4413 30.1926L18.476 30.0133L19.1404 25.7969L19.1831 25.5656C19.2481 25.152 19.6038 24.8484 20.0217 24.8484H20.5495C23.9685 24.8484 26.645 23.4602 27.4272 19.4433C27.754 17.7653 27.5848 16.3642 26.7202 15.3787C26.4584 15.0816 26.1338 14.835 25.7543 14.6341Z" fill="#179BD7" />
      <path d="M24.8187 14.261C24.6821 14.2212 24.5411 14.1851 24.3965 14.1525C24.2512 14.1207 24.1022 14.0925 23.949 14.068C23.4125 13.9812 22.8247 13.94 22.195 13.94H16.8796C16.7488 13.94 16.6244 13.9696 16.5131 14.0231C16.268 14.141 16.0858 14.3731 16.0417 14.6572L14.911 21.8191L14.8784 22.028C14.9529 21.5566 15.3556 21.2096 15.8335 21.2096H17.8231C21.7309 21.2096 24.7905 19.6234 25.6848 15.0317C25.7116 14.8958 25.734 14.7635 25.7543 14.6341C25.528 14.514 25.2829 14.4114 25.019 14.3239C24.9539 14.3022 24.8867 14.2812 24.8187 14.261Z" fill="#222D65" />
      <path d="M16.0417 14.6572C16.0858 14.3731 16.268 14.1403 16.5131 14.0231C16.6251 13.9696 16.7488 13.9407 16.8796 13.9407H22.195C22.8247 13.9407 23.4125 13.9819 23.949 14.0687C24.1022 14.0933 24.2512 14.1207 24.3965 14.1525C24.5411 14.1851 24.6821 14.2212 24.8187 14.261C24.8867 14.2812 24.9532 14.3029 25.019 14.3239C25.2829 14.4114 25.528 14.514 25.7543 14.6341C26.0203 12.9372 25.7528 11.7819 24.8353 10.7357C23.8239 9.58402 21.9984 9.09094 19.6624 9.09094H12.8808C12.4036 9.09094 11.9966 9.43797 11.9229 9.91008L9.09816 27.8148C9.04249 28.169 9.31578 28.4886 9.67294 28.4886H13.8597L14.911 21.8191L16.0417 14.6572Z" fill="#253B80" />
    </svg>
  );
}

/* ── Color resolver — exact fills from Figma SVG exports ───────────────────── */

function getColors(state: AccordionState) {
  switch (state) {
    case 'Hover':
      return {
        /* Hover: ALL elements use #045477, NO border */
        borderColor: 'transparent',
        hasBorder: false,
        bgColor: 'var(--atom-background-primary-bg-primary-inverse, #ffffff)',
        elementColor: 'var(--atom-foreground-states-fg-hover, #045477)',
        titleColor: 'var(--atom-foreground-states-fg-hover, #045477)',
        subtitleColor: 'var(--atom-foreground-states-fg-hover, #045477)',
        bodyColor: 'var(--atom-foreground-states-fg-hover, #045477)',
        badgeBg: 'var(--atom-background-core-bg-muted, #f5f5f4)',
        cursor: 'pointer' as const,
      };
    case 'Focus':
      return {
        /* Focus: same colors as Default + 1px border + 2px outline ring */
        borderColor: 'var(--atom-border-default-border-divider, #cdcbcb)',
        hasBorder: true,
        bgColor: 'var(--atom-background-primary-bg-primary-inverse, #ffffff)',
        elementColor: 'var(--atom-foreground-core-fg-primary, #4b4a4a)',
        titleColor: 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)',
        subtitleColor: 'var(--atom-foreground-core-fg-secondary, #737272)',
        bodyColor: 'var(--atom-foreground-core-fg-primary, #4b4a4a)',
        badgeBg: 'var(--atom-background-core-bg-muted, #f5f5f4)',
        cursor: 'pointer' as const,
      };
    case 'Disabled':
      return {
        /* Disabled: ALL elements #91908F, NO border, muted bg #FAF8F7 */
        borderColor: 'transparent',
        hasBorder: false,
        bgColor: 'var(--atom-background-core-bg-muted, #faf8f7)',
        elementColor: 'var(--atom-foreground-states-fg-disabled, #91908f)',
        titleColor: 'var(--atom-foreground-states-fg-disabled, #91908f)',
        subtitleColor: 'var(--atom-foreground-states-fg-disabled, #91908f)',
        bodyColor: 'var(--atom-foreground-states-fg-disabled, #91908f)',
        badgeBg: 'var(--atom-background-core-bg-muted, #f5f5f4)',
        cursor: 'default' as const,
      };
    default:
      return {
        /* Default: icon/chevron #4B4A4A, title #0A2333, 1px border #CDCBCB */
        borderColor: 'var(--atom-border-default-border-divider, #cdcbcb)',
        hasBorder: true,
        bgColor: 'var(--atom-background-primary-bg-primary-inverse, #ffffff)',
        elementColor: 'var(--atom-foreground-core-fg-primary, #4b4a4a)',
        titleColor: 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)',
        subtitleColor: 'var(--atom-foreground-core-fg-secondary, #737272)',
        bodyColor: 'var(--atom-foreground-core-fg-primary, #4b4a4a)',
        badgeBg: 'var(--atom-background-core-bg-muted, #f5f5f4)',
        cursor: 'pointer' as const,
      };
  }
}

/* ── Header height — exact Figma SVG dimensions ───────────────────────────── */

function getHeaderHeight(
  state: AccordionState,
  style: AccordionStyle,
  opened: boolean,
): number {
  if (style === 'GPay' || style === 'ApplePay' || style === 'PayPal') {
    /* Payment styles: always 72px header for all states and opened values */
    return 72;
  }
  /* Full Border & Bottom Border */
  if (state === 'Default') return 56;
  /* Disabled Opened uses Default-style header (56px) per SVG */
  if (state === 'Disabled' && opened) return 56;
  /* Hover, Focus, Disabled-closed: 52 */
  return 52;
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export function AccordionLive({
  style = 'Full Border',
  state = 'Default',
  opened = false,
  backgroundFill = true,
  showIconLeft = true,
  showCountryFlag = false,
  titleText = 'Title',
  showSubtitle = false,
  subtitleText = 'Subtitle',
  showBadge = false,
  showContent = true,
  contentText = 'Content',
  brand: _brand = 'dragonpass',
}: AccordionLiveProps) {
  const colors = getColors(state);
  const fontFamily = 'var(--atom-font-body, Poppins, sans-serif)';
  const headerHeight = getHeaderHeight(state, style, opened);

  const isBottomBorder = style === 'Bottom Border';

  /* ── Container border & radius (from SVG structure) ── */
  /*
   * BG=Yes: inside border (CSS border) — total size includes border
   * BG=No:  outside border (CSS outline at 1px) — border outside content, no size impact
   */
  let containerBorder: string;
  let containerOutlineBorder: string | undefined;
  let containerRadius: string;

  if (isBottomBorder) {
    /* Bottom Border: 1px bottom-only border on container, radius = 0 */
    containerBorder = 'none';
    containerOutlineBorder = undefined;
    containerRadius = '0';
  } else if (colors.hasBorder && backgroundFill) {
    /* Default & Focus with BG=Yes: 1px inside border #CDCBCB */
    containerBorder = `1px solid ${colors.borderColor}`;
    containerOutlineBorder = undefined;
    containerRadius = '8px';
  } else if (colors.hasBorder && !backgroundFill) {
    /* Default & Focus with BG=No: 1px outside border (rendered as outline) */
    containerBorder = 'none';
    containerOutlineBorder = `1px solid ${colors.borderColor}`;
    containerRadius = '8px';
  } else {
    /* Hover & Disabled: no border at all */
    containerBorder = 'none';
    containerOutlineBorder = undefined;
    containerRadius = '8px';
  }

  /* Bottom-border style: 1px divider at the bottom of the entire container (Default & Focus only) */
  const containerBottomBorder =
    isBottomBorder && colors.hasBorder
      ? `1px solid ${colors.borderColor}`
      : 'none';

  /*
   * Container border eats into the component height (Figma SVG dimensions
   * are total, including border). Only applies when BG=Yes (inside border).
   * BG=No uses outline (outside), so no height adjustment needed.
   * Bottom Border style has no container border (border is on header instead).
   */
  const containerBorderPx = !isBottomBorder && colors.hasBorder && backgroundFill ? 1 : 0;
  const adjustedHeaderHeight = headerHeight - containerBorderPx * 2;

  /* Focus ring: 2px outside ring with 2px gap (from SVG outer mask) */
  /* When BG=No has a 1px outline border, focus ring stacks outside it */
  const focusOutline =
    state === 'Focus'
      ? '2px solid var(--atom-border-selection-and-focus-border-primary-focus, #0a2333)'
      : containerOutlineBorder ?? 'none';
  const focusOutlineOffset = state === 'Focus' ? '2px' : containerOutlineBorder ? '0px' : undefined;

  return (
    <div
      style={{
        width: '100%',
        fontFamily,
        border: containerBorder,
        ...(isBottomBorder ? { borderBottom: containerBottomBorder } : {}),
        borderRadius: containerRadius,
        backgroundColor: backgroundFill ? colors.bgColor : 'transparent',
        overflow: 'hidden',
        outline: focusOutline,
        outlineOffset: focusOutlineOffset,
        boxSizing: 'border-box',
      }}
    >
      {/* ── Header row ───────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          height: `${adjustedHeaderHeight}px`,
          padding: '0 16px',
          cursor: colors.cursor,
          gap: '12px',
          boxSizing: 'border-box',
        }}
      >
        {/* Country flag */}
        {showCountryFlag && (
          <span
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              width: '20px',
              height: '20px',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '14px',
            }}
          >
            {'\u{1F1EC}\u{1F1E7}'}
          </span>
        )}

        {/* Icon Left — placeholder icon or payment logo */}
        {showIconLeft && !showCountryFlag && (
          <span
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {style === 'GPay' ? (
              <GooglePayIcon />
            ) : style === 'ApplePay' ? (
              <ApplePayIcon />
            ) : style === 'PayPal' ? (
              <PayPalIcon />
            ) : (
              <PlaceholderIcon color={colors.elementColor} />
            )}
          </span>
        )}

        {/* Title + optional subtitle */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: colors.titleColor,
              lineHeight: '20px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {titleText}
          </span>
          {showSubtitle && (
            <span
              style={{
                fontSize: '12px',
                fontWeight: 400,
                color: colors.subtitleColor,
                lineHeight: '16px',
              }}
            >
              {subtitleText}
            </span>
          )}
        </div>

        {/* Badge */}
        {showBadge && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 8px',
              borderRadius: '10px',
              backgroundColor: colors.badgeBg,
              fontSize: '11px',
              fontWeight: 500,
              color: colors.subtitleColor,
              flexShrink: 0,
            }}
          >
            Badge
          </span>
        )}

        {/* Chevron — separate up/down paths from Figma */}
        <span
          aria-hidden="true"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {opened ? (
            <ChevronUp color={colors.elementColor} />
          ) : (
            <ChevronDown color={colors.elementColor} />
          )}
        </span>
      </div>

      {/* ── Content body (visible when opened) ───────────────────────────── */}
      {opened && showContent && (
        <div
          style={{
            padding: '0 16px 12px',
            fontSize: '14px',
            fontWeight: 400,
            color: colors.bodyColor,
            lineHeight: '20px',
          }}
        >
          {contentText}
        </div>
      )}
    </div>
  );
}
