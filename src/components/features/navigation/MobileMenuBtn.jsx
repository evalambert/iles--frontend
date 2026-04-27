//src/components/features/navigation/MobileMenuBtn.jsx

export default function MobileMenuBtn() {
    const handleClick = () => {
        window.dispatchEvent(new CustomEvent('mobile-nav:toggle'));
    };

    return <>
        <button id="mobile-nav-toggle" class="w-full h-full flex items-center justify-center" onClick={handleClick}>
            <svg
                id="open-nav-icon"
                class="hidden"
                width="25"
                height="27"
                viewBox="0 0 25 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M0.146447 3.32842C-0.0488155 3.52369 -0.0488155 3.84027 0.146447 4.03553L3.32843 7.21751C3.52369 7.41277 3.84027 7.41277 4.03553 7.21751C4.2308 7.02225 4.2308 6.70567 4.03553 6.5104L1.20711 3.68198L4.03553 0.853549C4.2308 0.658287 4.2308 0.341705 4.03553 0.146442C3.84027 -0.0488198 3.52369 -0.0488198 3.32843 0.146442L0.146447 3.32842ZM0.5 3.68198L0.5 4.18198L24.5 4.18198V3.68198V3.18198L0.5 3.18198L0.5 3.68198Z"
                    fill="#2F2F2E"></path>
                <line
                    x1="24"
                    y1="3.68198"
                    x2="24"
                    y2="26.682"
                    stroke="#2F2F2E"></line>
            </svg>
            <svg
                id="close-nav-icon"
                width="26"
                height="25"
                viewBox="0 0 26 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <line
                    x1="0.353478"
                    y1="24.3952"
                    x2="24.3951"
                    y2="0.35355"
                    stroke="#2F2F2E"></line>
                <line
                    x1="1.06058"
                    y1="0.353554"
                    x2="25.1022"
                    y2="24.3952"
                    stroke="#2F2F2E"></line>
            </svg>
        </button>

    </>;
}
