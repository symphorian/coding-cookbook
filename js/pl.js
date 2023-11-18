const searchParams = new URLSearchParams(window.location.search);
if (searchParams.has("ischeater")) {
    document.body.innerHTML += `
        <style>
            #cheater-container {
                position: fixed;
                top: 0px;
                left: 0px;
                width: 100vw;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                background: radial-gradient(circle at center, var(--color), #00000099);
                animation: glow 2s infinite ease-in-out;
            }

            #cheater-dialog {
                max-width: 600px;
                text-align: center;
                background-color: black;
                color: red;
                border: 10px solid red;
                box-shadow: 
                    0px 0px 16px 16px #FF000066,
                    inset 0px 0px 16px 16px #FF000066;
                padding: 36px;
            }

            #cheater-dialog h1 {
                font-size: 60px;
                font-family: Verdana, Geneva, Tahoma, sans-serif
            }

            #cheater-dialog p {
                font-size: 24px;
            }

            @keyframes glow {
                0%, 100% {
                    --color: #00000099;
                }
                50% {
                    --color: #FF000099;
                }
            }

            @property --color {
                syntax: "<color>";
                inherits: false;
                initial-value: #00000099;
            }
        </style>
        <div id="cheater-container">
            <div id="cheater-dialog">
                <h1>PLAGIARISM DETECTED</h1>
                <p>
                    This page contains code from an illegitimate code source.
                </p>
            </div>
        </div>
    `;
}