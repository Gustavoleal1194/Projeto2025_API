import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Variável para controlar qual elemento está ativo (igual ao vanilla)
    let activeElement: string | null = null;
    const navigate = useNavigate();
    const yetiRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const API_BASE_URL = 'http://localhost:5072/api';

    useEffect(() => {
        if (yetiRef.current && formRef.current) {
            const svg = yetiRef.current.querySelector('svg');
            if (!svg) return;

            // Elementos do Yeti
            const eyeL = svg.querySelector('.eyeL');
            const eyeR = svg.querySelector('.eyeR');
            const nose = svg.querySelector('.nose');
            const mouth = svg.querySelector('.mouth');
            // const mouthBG = svg.querySelector('.mouthBG');
            // const mouthOutline = svg.querySelector('.mouthOutline');
            const chin = svg.querySelector('.chin');
            const face = svg.querySelector('.face');
            const eyebrow = svg.querySelector('.eyebrow');
            const outerEarL = svg.querySelector('.earL .outerEar');
            const outerEarR = svg.querySelector('.earR .outerEar');
            const earHairL = svg.querySelector('.earL .earHair');
            const earHairR = svg.querySelector('.earR .earHair');
            const hair = svg.querySelector('.hair');
            const armL = svg.querySelector('.armL');
            const armR = svg.querySelector('.armR');
            const twoFingers = svg.querySelector('.twoFingers');
            const bodyBG = svg.querySelector('.bodyBGnormal');

            console.log('Elementos encontrados:', {
                eyeL: !!eyeL,
                eyeR: !!eyeR,
                armL: !!armL,
                armR: !!armR,
                twoFingers: !!twoFingers,
                bodyBG: !!bodyBG
            });

            // Variáveis de estado
            let mouthStatus = "small";
            let eyeScale = 1;
            let eyesCovered = false;
            let blinking: gsap.core.Tween | null = null;

            // Função para calcular movimento do rosto
            const calculateFaceMove = (e: React.ChangeEvent<HTMLInputElement>) => {
                const input = e.target;
                const carPos = input.selectionEnd || input.value.length;
                const inputRect = input.getBoundingClientRect();
                const svgRect = svg.getBoundingClientRect();

                const caretX = inputRect.left + (carPos * 8); // Aproximação da posição do cursor
                const caretY = inputRect.top + 25;

                const screenCenter = svgRect.left + (svgRect.width / 2);
                const dFromC = screenCenter - caretX;

                // Coordenadas dos elementos
                const eyeLCoords = { x: svgRect.left + 84, y: svgRect.top + 76 };
                const eyeRCoords = { x: svgRect.left + 113, y: svgRect.top + 76 };
                const noseCoords = { x: svgRect.left + 97, y: svgRect.top + 81 };
                const mouthCoords = { x: svgRect.left + 100, y: svgRect.top + 100 };

                // Calcular ângulos
                const getAngle = (x1: number, y1: number, x2: number, y2: number) => {
                    return Math.atan2(y1 - y2, x1 - x2);
                };

                const eyeLAngle = getAngle(eyeLCoords.x, eyeLCoords.y, caretX, caretY);
                const eyeRAngle = getAngle(eyeRCoords.x, eyeRCoords.y, caretX, caretY);
                const noseAngle = getAngle(noseCoords.x, noseCoords.y, caretX, caretY);
                const mouthAngle = getAngle(mouthCoords.x, mouthCoords.y, caretX, caretY);

                // Calcular movimentos
                const eyeLX = Math.cos(eyeLAngle) * 20;
                const eyeLY = Math.sin(eyeLAngle) * 10;
                const eyeRX = Math.cos(eyeRAngle) * 20;
                const eyeRY = Math.sin(eyeRAngle) * 10;
                const noseX = Math.cos(noseAngle) * 23;
                const noseY = Math.sin(noseAngle) * 10;
                const mouthX = Math.cos(mouthAngle) * 23;
                const mouthY = Math.sin(mouthAngle) * 10;
                const mouthR = Math.cos(mouthAngle) * 6;
                const chinX = mouthX * 0.8;
                const chinY = mouthY * 0.5;
                const chinS = Math.max(0.5, 1 - ((dFromC * 0.15) / 100));
                const faceX = mouthX * 0.3;
                const faceY = mouthY * 0.4;
                const faceSkew = Math.cos(mouthAngle) * 5;
                const eyebrowSkew = Math.cos(mouthAngle) * 25;
                const outerEarX = Math.cos(mouthAngle) * 4;
                const outerEarY = Math.cos(mouthAngle) * 5;
                const hairX = Math.cos(mouthAngle) * 6;
                const hairS = 1.2;

                // Aplicar animações
                gsap.to(eyeL, 1, { x: -eyeLX, y: -eyeLY, ease: "expo.out" });
                gsap.to(eyeR, 1, { x: -eyeRX, y: -eyeRY, ease: "expo.out" });
                gsap.to(nose, 1, { x: -noseX, y: -noseY, rotation: mouthR, transformOrigin: "center center", ease: "expo.out" });
                gsap.to(mouth, 1, { x: -mouthX, y: -mouthY, rotation: mouthR, transformOrigin: "center center", ease: "expo.out" });
                gsap.to(chin, 1, { x: -chinX, y: -chinY, scaleY: chinS, ease: "expo.out" });
                gsap.to(face, 1, { x: -faceX, y: -faceY, skewX: -faceSkew, transformOrigin: "center top", ease: "expo.out" });
                gsap.to(eyebrow, 1, { x: -faceX, y: -faceY, skewX: -eyebrowSkew, transformOrigin: "center top", ease: "expo.out" });
                gsap.to(outerEarL, 1, { x: outerEarX, y: -outerEarY, ease: "expo.out" });
                gsap.to(outerEarR, 1, { x: outerEarX, y: outerEarY, ease: "expo.out" });
                gsap.to(earHairL, 1, { x: -outerEarX, y: -outerEarY, ease: "expo.out" });
                gsap.to(earHairR, 1, { x: -outerEarX, y: outerEarY, ease: "expo.out" });
                gsap.to(hair, 1, { x: hairX, scaleY: hairS, transformOrigin: "center bottom", ease: "expo.out" });
            };

            // Função para animar boca baseado no email
            const animateMouth = (value: string) => {
                const tooth = svg.querySelector('.tooth');
                const tongue = svg.querySelector('.tongue');
                // const mouthSmallBG = svg.querySelector('.mouthSmallBG');
                // const mouthMediumBG = svg.querySelector('.mouthMediumBG');
                // const mouthLargeBG = svg.querySelector('.mouthLargeBG');

                if (value.length > 0) {
                    if (mouthStatus === "small") {
                        mouthStatus = "medium";
                        gsap.to([eyeL, eyeR], 1, { scaleX: 0.85, scaleY: 0.85, ease: "expo.out" });
                        gsap.to(tooth, 1, { x: 0, y: 0, ease: "expo.out" });
                        gsap.to(tongue, 1, { x: 0, y: 1, ease: "expo.out" });
                        eyeScale = 0.85;
                    }
                    if (value.includes("@")) {
                        mouthStatus = "large";
                        gsap.to([eyeL, eyeR], 1, { scaleX: 0.65, scaleY: 0.65, ease: "expo.out" });
                        gsap.to(tooth, 1, { x: 3, y: -2, ease: "expo.out" });
                        gsap.to(tongue, 1, { y: 2, ease: "expo.out" });
                        eyeScale = 0.65;
                    } else {
                        mouthStatus = "medium";
                        gsap.to([eyeL, eyeR], 1, { scaleX: 0.85, scaleY: 0.85, ease: "expo.out" });
                        gsap.to(tooth, 1, { x: 0, y: 0, ease: "expo.out" });
                        gsap.to(tongue, 1, { x: 0, y: 1, ease: "expo.out" });
                        eyeScale = 0.85;
                    }
                } else {
                    mouthStatus = "small";
                    gsap.to([eyeL, eyeR], 1, { scaleX: 1, scaleY: 1, ease: "expo.out" });
                    gsap.to(tooth, 1, { x: 0, y: 0, ease: "expo.out" });
                    gsap.to(tongue, 1, { y: 0, ease: "expo.out" });
                    eyeScale = 1;
                }
            };

            // Função para cobrir olhos
            const coverEyes = () => {
                console.log('Covering eyes...', { armL, armR, bodyBG });
                if (armL && armR) {
                    gsap.killTweensOf([armL, armR]);
                    gsap.set([armL, armR], { visibility: "visible" });
                    // Resetar posição dos olhos para que as mãos possam cobrir
                    gsap.set([eyeL, eyeR], { x: 0, y: 0, scaleX: 1, scaleY: 1 });
                    // Animação correta para cobrir os olhos - posições exatas do vanilla
                    gsap.to(armL, 0.45, { x: -93, y: 10, rotation: 0, ease: "quad.out" });
                    gsap.to(armR, 0.45, { x: -93, y: 10, rotation: 0, ease: "quad.out", delay: 0.1 });
                    eyesCovered = true;
                } else {
                    console.log('Braços não encontrados!');
                }
            };

            // Função para descobrir olhos
            const uncoverEyes = () => {
                console.log('Uncovering eyes...', { armL, armR, bodyBG });
                if (armL && armR) {
                    gsap.killTweensOf([armL, armR]);
                    // Animação correta para descobrir os olhos - posições exatas do vanilla
                    gsap.to(armL, 1.35, { y: 220, ease: "quad.out" });
                    gsap.to(armL, 1.35, { rotation: 105, ease: "quad.out", delay: 0.1 });
                    gsap.to(armR, 1.35, { y: 220, ease: "quad.out" });
                    gsap.to(armR, 1.35, {
                        rotation: -105, ease: "quad.out", delay: 0.1, onComplete: () => {
                            gsap.set([armL, armR], { visibility: "hidden" });
                        }
                    });
                    eyesCovered = false;
                } else {
                    console.log('Braços não encontrados para descobrir!');
                }
            };

            // Função para resetar rosto
            const resetFace = () => {
                gsap.to([eyeL, eyeR], 1, { x: 0, y: 0, ease: "expo.out" });
                gsap.to(nose, 1, { x: 0, y: 0, scaleX: 1, scaleY: 1, ease: "expo.out" });
                gsap.to(mouth, 1, { x: 0, y: 0, rotation: 0, ease: "expo.out" });
                gsap.to(chin, 1, { x: 0, y: 0, scaleY: 1, ease: "expo.out" });
                gsap.to([face, eyebrow], 1, { x: 0, y: 0, skewX: 0, ease: "expo.out" });
                gsap.to([outerEarL, outerEarR, earHairL, earHairR, hair], 1, { x: 0, y: 0, scaleY: 1, ease: "expo.out" });
            };

            // Função para piscar
            const startBlinking = (delay: number = 1) => {
                const randomDelay = Math.floor(Math.random() * delay) + 1;
                blinking = gsap.to([eyeL, eyeR], 0.1, {
                    delay: randomDelay,
                    scaleY: 0,
                    yoyo: true,
                    repeat: 1,
                    transformOrigin: "center center",
                    onComplete: () => {
                        startBlinking(12);
                    }
                });
            };

            // Função para parar piscar
            const stopBlinking = () => {
                if (blinking) {
                    blinking.kill();
                    blinking = null;
                }
                gsap.set([eyeL, eyeR], { scaleY: eyeScale });
            };

            // Função para espalhar dedos
            const spreadFingers = () => {
                console.log('Spreading fingers...', { twoFingers });
                if (twoFingers) {
                    console.log('Animando dedos para abrir...');
                    gsap.to(twoFingers, 0.35, { transformOrigin: "bottom left", rotation: 30, x: -9, y: -2, ease: "power2.inOut" });
                } else {
                    console.log('Dedos não encontrados para espalhar!');
                }
            };

            // Função para fechar dedos
            const closeFingers = () => {
                console.log('Closing fingers...', { twoFingers });
                if (twoFingers) {
                    console.log('Animando dedos para fechar...');
                    gsap.to(twoFingers, 0.35, { transformOrigin: "bottom left", rotation: 0, x: 0, y: 0, ease: "power2.inOut" });
                } else {
                    console.log('Dedos não encontrados para fechar!');
                }
            };

            // Configuração inicial - EXATAMENTE igual ao vanilla
            if (armL && armR) {
                gsap.set(armL, { x: -93, y: 220, rotation: 105, transformOrigin: "top left", visibility: "hidden" });
                gsap.set(armR, { x: -93, y: 220, rotation: -105, transformOrigin: "top right", visibility: "hidden" });
            }
            if (mouth) {
                gsap.set(mouth, { transformOrigin: "center center" });
            }

            // Iniciar piscar
            startBlinking(5);

            // Aguardar um pouco para garantir que os elementos estejam renderizados
            setTimeout(() => {
                // Event listeners para email
                const emailInput = formRef.current?.querySelector('input[type="email"]') as HTMLInputElement;
                if (emailInput) {
                    const handleEmailInput = (e: Event) => {
                        const target = e.target as HTMLInputElement;
                        // Só mover os olhos se estiver realmente focado no email
                        if (activeElement === "email") {
                            calculateFaceMove({ target } as any);
                        }
                        animateMouth(target.value);
                    };

                    const handleEmailFocus = () => {
                        // Só focar no email se não estiver na senha
                        if (activeElement !== "password" && activeElement !== "toggle") {
                            activeElement = "email";
                            stopBlinking();
                            if (emailInput.value) {
                                calculateFaceMove({ target: emailInput } as any);
                            }
                        }
                    };

                    const handleEmailBlur = () => {
                        activeElement = null;
                        setTimeout(() => {
                            if (activeElement === "email") {
                                // Se voltou para o email, não fazer nada
                            } else {
                                // Sempre resetar o rosto quando sair do email
                                resetFace();
                                // Só reiniciar o piscar se não estiver cobrindo os olhos
                                if (!eyesCovered) {
                                    startBlinking();
                                }
                            }
                        }, 100);
                    };

                    emailInput.addEventListener('input', handleEmailInput);
                    emailInput.addEventListener('focus', handleEmailFocus);
                    emailInput.addEventListener('blur', handleEmailBlur);
                }

                // Event listeners para senha - usar o input que tem o placeholder "Digite sua senha"
                const passwordInput = formRef.current?.querySelector('input[placeholder="Digite sua senha"]') as HTMLInputElement;
                if (passwordInput) {
                    console.log('Password input found:', passwordInput);

                    const handlePasswordFocus = () => {
                        console.log('Password focused - covering eyes');
                        activeElement = "password";
                        // Resetar o rosto para ficar reto quando focar na senha
                        resetFace();
                        if (!eyesCovered) {
                            coverEyes();
                        }
                    };

                    const handlePasswordBlur = () => {
                        console.log('Password blurred - uncovering eyes');
                        activeElement = null;
                        setTimeout(() => {
                            if (activeElement === "toggle" || activeElement === "password") {
                                // Se voltou para a senha ou toggle, não fazer nada
                            } else {
                                uncoverEyes();
                                // Reiniciar o piscar quando sair da senha
                                startBlinking();
                            }
                        }, 100);
                    };

                    passwordInput.addEventListener('focus', handlePasswordFocus);
                    passwordInput.addEventListener('blur', handlePasswordBlur);
                } else {
                    console.log('Password input NOT found');
                }

                // Event listener para mostrar senha
                const showPasswordCheck = formRef.current?.querySelector('input[type="checkbox"]') as HTMLInputElement;
                if (showPasswordCheck) {
                    console.log('Show password checkbox found:', showPasswordCheck);

                    const handlePasswordToggle = (e: Event) => {
                        const target = e.target as HTMLInputElement;
                        console.log('Password toggle changed:', target.checked);

                        // Manter os olhos cobertos quando o checkbox está marcado
                        if (target.checked) {
                            activeElement = "toggle";
                            console.log('Spreading fingers');
                            spreadFingers();
                            // Voltar o foco para o input da senha
                            setTimeout(() => {
                                console.log('Voltando foco para o input da senha...');
                                passwordInput.focus();
                                console.log('Foco retornado para:', document.activeElement);
                            }, 50);
                        } else {
                            activeElement = "password";
                            console.log('Closing fingers');
                            closeFingers();
                        }
                    };

                    showPasswordCheck.addEventListener('change', handlePasswordToggle);
                } else {
                    console.log('Show password checkbox NOT found');
                }
            }, 100); // Delay de 100ms

            return () => {
                if (blinking) {
                    blinking.kill();
                }
                gsap.killTweensOf(svg);
            };
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    senha: password
                })
            });

            const data = await response.json();

            if (response.ok) {

                localStorage.setItem('yeti_token', data.token);
                localStorage.setItem('yeti_user', JSON.stringify({
                    id: data.id,
                    nome: data.nome,
                    email: data.email,
                    role: data.role
                }));

                // Redirecionar baseado no tipo de usuário
                if (data.role === 'Admin' || data.role === 'Funcionario') {
                    navigate('/dashboard');
                } else {
                    navigate('/usuario-dashboard');
                }
            } else {
                alert(data.message || 'Erro ao fazer login');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro ao conectar com o servidor');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin(e);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f3fafd',
            backgroundImage: `
        url('./images/logo.png'),
        radial-gradient(circle at 20% 80%, rgba(52, 104, 140, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(74, 125, 92, 0.1) 0%, transparent 50%)
      `,
            backgroundSize: '80% auto, auto, auto',
            backgroundPosition: 'center center, 20% 80%, 80% 20%',
            backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
            position: 'relative',
            width: '100%',
            height: '100%',
            fontFamily: 'Source Sans Pro, sans-serif',
            fontSize: '16px',
            fontWeight: '400',
            WebkitFontSmoothing: 'antialiased'
        }}>
            {/* Overlay escuro */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `
          linear-gradient(to right, #f3fafd 0%, transparent 15%, transparent 85%, #f3fafd 100%),
          rgba(0, 0, 0, 0.1)
        `,
                zIndex: -1
            }} />

            {/* Logo SVG de fundo */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjNmYWZkIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjE1MCIgcj0iMTMwIiBmaWxsPSJub25lIiBzdHJva2U9IiMzNDY4OGMiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWRhc2hhcnJheT0iMTAgMTAiIG9wYWNpdHk9IjAuNCIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNTAiIHI9IjEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNGE3ZDVjIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1kYXNoYXJyYXk9IjUgMTUiIG9wYWNpdHk9IjAuMyIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNTAiIHI9IjcwIiBmaWxsPSJub25lIiBzdHJva2U9IiM4YjQ1MTMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWRhc2hhcnJheT0iMyA3IiBvcGFjaXR5PSIwLjIiLz4KPHN2ZyB4PSI3NSIgeT0iNzUiIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTUwIDE1MCI+CjxyZWN0IHg9IjQwIiB5PSI4MCIgd2lkdGg9IjcwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjOGI0NTEzIiBvcGFjaXR5PSIwLjMiLz4KPHJlY3QgeD0iMzUiIHk9Ijc1IiB3aWR0aD0iODAiIGhlaWdodD0iNSIgZmlsbD0iIzRhN2Q1YyIgb3BhY2l0eT0iMC40Ii8+CjxyZWN0IHg9IjMwIiB5PSI3MCIgd2lkdGg9IjkwIiBoZWlnaHQ9IjUiIGZpbGw9IiM3NGFiYWIiIG9wYWNpdHk9IjAuNCIvPgo8Y2lyY2xlIGN4PSI3NSIgY3k9IjQ1IiByPSIyMCIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMzQ2ODhjIiBzdHJva2Utd2lkdGg9IjMiIG9wYWNpdHk9IjAuNiIvPgo8cGF0aCBkPSJNNjUgMzUgTDg1IDM1IE02NSA1NSBMODUgNTUiIHN0cm9rZT0iIzM0Njg4YyIgc3Ryb2tlLXdpZHRoPSIzIiBvcGFjaXR5PSIwLjYiLz4KPC9zdmc+Cjx0ZXh0IHg9IjE1MCIgeT0iMjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzQ2ODhjIiBmb250LWZhbWlseT0iU291cmNlIFNhbnMgUHJvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iNjAwIiBvcGFjaXR5PSIwLjUiPllFVEkgTElCUkFSWSBTeVNURU08L3RleHQ+Cjwvc3ZnPg==')`,
                backgroundSize: '300px 300px',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: 0.3,
                zIndex: -2
            }} />

            {/* Formulário de Login */}
            <form
                ref={formRef}
                onSubmit={handleLogin}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'block',
                    width: '100%',
                    maxWidth: '400px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    margin: 0,
                    padding: '2.25em',
                    boxSizing: 'border-box',
                    border: 'solid 1px rgba(221, 221, 221, 0.3)',
                    borderRadius: '0.5em',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    fontFamily: 'Source Sans Pro, sans-serif'
                }}
            >
                {/* Avatar Yeti */}
                <div
                    ref={yetiRef}
                    style={{
                        position: 'relative',
                        width: '200px',
                        height: '200px',
                        margin: '0 auto 1em',
                        borderRadius: '50%',
                        pointerEvents: 'none'
                    }}
                >
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: 0,
                        overflow: 'hidden',
                        borderRadius: '50%',
                        paddingBottom: '100%'
                    }}>
                        <svg
                            className="mySVG"
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: '100%',
                                height: '100%',
                                pointerEvents: 'none'
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 200 200"
                        >
                            <defs>
                                <circle id="armMaskPath" cx="100" cy="100" r="100" />
                            </defs>
                            <clipPath id="armMask">
                                <use xlinkHref="#armMaskPath" overflow="visible" />
                            </clipPath>
                            <circle cx="100" cy="100" r="100" fill="#a9ddf3" />
                            <g className="body">
                                <path className="bodyBGnormal" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#FFFFFF" d="M200,158.5c0-20.2-14.8-36.5-35-36.5h-14.9V72.8c0-27.4-21.7-50.4-49.1-50.8c-28-0.5-50.9,22.1-50.9,50v50 H35.8C16,122,0,138,0,157.8L0,213h200L200,158.5z" />
                                <path className="bodyBGchanged" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#FFFFFF" d="M200,158.5c0-20.2-14.8-36.5-35-36.5h-14.9V72.8c0-27.4-21.7-50.4-49.1-50.8c-28-0.5-50.9,22.1-50.9,50v50 H35.8C16,122,0,138,0,157.8L0,213h200L200,158.5z" />
                                <path fill="#DDF1FA" d="M100,156.4c-22.9,0-43,11.1-54.1,27.7c15.6,10,34.2,15.9,54.1,15.9s38.5-5.8,54.1-15.9 C143,167.5,122.9,156.4,100,156.4z" />
                            </g>
                            <g className="earL">
                                <g className="outerEar" fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5">
                                    <circle cx="47" cy="83" r="11.5" />
                                    <path d="M46.3 78.9c-2.3 0-4.1 1.9-4.1 4.1 0 2.3 1.9 4.1 4.1 4.1" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <g className="earHair">
                                    <rect x="51" y="64" fill="#FFFFFF" width="15" height="35" />
                                    <path d="M53.4 62.8C48.5 67.4 45 72.2 42.8 77c3.4-.1 6.8-.1 10.1.1-4 3.7-6.8 7.6-8.2 11.6 2.1 0 4.2 0 6.3.2-2.6 4.1-3.8 8.3-3.7 12.5 1.2-.7 3.4-1.4 5.2-1.9" fill="#fff" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                            </g>
                            <g className="earR">
                                <g className="outerEar">
                                    <circle fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" cx="153" cy="83" r="11.5" />
                                    <path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M153.7,78.9 c2.3,0,4.1,1.9,4.1,4.1c0,2.3-1.9,4.1-4.1,4.1" />
                                </g>
                                <g className="earHair">
                                    <rect x="134" y="64" fill="#FFFFFF" width="15" height="35" />
                                    <path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M146.6,62.8 c4.9,4.6,8.4,9.4,10.6,14.2c-3.4-0.1-6.8-0.1-10.1,0.1c4,3.7,6.8,7.6,8.2,11.6c-2.1,0-4.2,0-6.3,0.2c2.6,4.1,3.8,8.3,3.7,12.5 c-1.2-0.7-3.4-1.4-5.2-1.9" />
                                </g>
                            </g>
                            <path className="chin" d="M84.1 121.6c2.7 2.9 6.1 5.4 9.8 7.5l.9-4.5c2.9 2.5 6.3 4.8 10.2 6.5 0-1.9-.1-3.9-.2-5.8 3 1.2 6.2 2 9.7 2.5-.3-2.1-.7-4.1-1.2-6.1" fill="none" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path className="face" fill="#DDF1FA" d="M134.5,46v35.5c0,21.815-15.446,39.5-34.5,39.5s-34.5-17.685-34.5-39.5V46" />
                            <path className="hair" fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M81.457,27.929 c1.755-4.084,5.51-8.262,11.253-11.77c0.979,2.565,1.883,5.14,2.712,7.723c3.162-4.265,8.626-8.27,16.272-11.235 c-0.737,3.293-1.588,6.573-2.554,9.837c4.857-2.116,11.049-3.64,18.428-4.156c-2.403,3.23-5.021,6.391-7.852,9.474" />
                            <g className="eyebrow">
                                <path fill="#FFFFFF" d="M138.142,55.064c-4.93,1.259-9.874,2.118-14.787,2.599c-0.336,3.341-0.776,6.689-1.322,10.037 c-4.569-1.465-8.909-3.222-12.996-5.226c-0.98,3.075-2.07,6.137-3.267,9.179c-5.514-3.067-10.559-6.545-15.097-10.329 c-1.806,2.889-3.745,5.73-5.816,8.515c-7.916-4.124-15.053-9.114-21.296-14.738l1.107-11.768h73.475V55.064z" />
                                <path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M63.56,55.102 c6.243,5.624,13.38,10.614,21.296,14.738c2.071-2.785,4.01-5.626,5.816-8.515c4.537,3.785,9.583,7.263,15.097,10.329 c1.197-3.043,2.287-6.104,3.267-9.179c4.087,2.004,8.427,3.761,12.996,5.226c0.545-3.348,0.986-6.696,1.322-10.037 c4.913-0.481,9.857-1.34,14.787-2.599" />
                            </g>
                            <g className="eyeL">
                                <circle cx="85.5" cy="78.5" r="3.5" fill="#3a5e77" />
                                <circle cx="84" cy="76" r="1" fill="#fff" />
                            </g>
                            <g className="eyeR">
                                <circle cx="114.5" cy="78.5" r="3.5" fill="#3a5e77" />
                                <circle cx="113" cy="76" r="1" fill="#fff" />
                            </g>
                            <g className="mouth">
                                <path className="mouthBG" fill="#617E92" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
                                <path className="mouthOutline" fill="none" stroke="#3A5E77" strokeWidth="2.5" strokeLinejoin="round" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
                                <path className="mouthSmallBG" fill="#617E92" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
                                <path className="mouthMediumBG" fill="#617E92" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
                                <path className="mouthLargeBG" fill="#617E92" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
                                <path className="mouthMaskPath" fill="none" stroke="#3A5E77" strokeWidth="2.5" strokeLinejoin="round" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
                                <circle className="tooth" cx="100" cy="98" r="2" fill="#FFFFFF" />
                                <circle className="tongue" cx="100" cy="102" r="3" fill="#FFB6C1" />
                            </g>
                            <path className="nose" d="M97.7 79.9h4.7c1.9 0 3 2.2 1.9 3.7l-2.3 3.3c-.9 1.3-2.9 1.3-3.8 0l-2.3-3.3c-1.3-1.6-.2-3.7 1.8-3.7z" fill="#3a5e77" />

                            {/* BRAÇOS - DEPOIS DOS OLHOS PARA FICAREM NA FRENTE */}
                            <g className="arms" style={{ zIndex: 10 }}>
                                <g className="armL" style={{ visibility: "hidden", zIndex: 10 }}>
                                    <polygon fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" points="121.3,98.4 111,59.7 149.8,49.3 169.8,85.4" />
                                    <path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M134.4,53.5l19.3-5.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-10.3,2.8" />
                                    <path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M150.9,59.4l26-7c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-21.3,5.7" />

                                    <g className="twoFingers">
                                        <path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M158.3,67.8l23.1-6.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-23.1,6.2" />
                                        <path fill="#A9DDF3" d="M180.1,65l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L180.1,65z" />
                                        <path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M160.8,77.5l19.4-5.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-18.3,4.9" />
                                        <path fill="#A9DDF3" d="M178.8,75.7l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L178.8,75.7z" />
                                    </g>
                                    <path fill="#A9DDF3" d="M175.5,55.9l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L175.5,55.9z" />
                                    <path fill="#A9DDF3" d="M152.1,50.4l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L152.1,50.4z" />
                                    <path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M123.5,97.8 c-41.4,14.9-84.1,30.7-108.2,35.5L1.2,81c33.5-9.9,71.9-16.5,111.9-21.8" />
                                    <path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M108.5,60.4 c7.7-5.3,14.3-8.4,22.8-13.2c-2.4,5.3-4.7,10.3-6.7,15.1c4.3,0.3,8.4,0.7,12.3,1.3c-4.2,5-8.1,9.6-11.5,13.9 c3.1,1.1,6,2.4,8.7,3.8c-1.4,2.9-2.7,5.8-3.9,8.5c2.5,3.5,4.6,7.2,6.3,11c-4.9-0.8-9-0.7-16.2-2.7" />
                                    <path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M94.5,103.8 c-0.6,4-3.8,8.9-9.4,14.7c-2.6-1.8-5-3.7-7.2-5.7c-2.5,4.1-6.6,8.8-12.2,14c-1.9-2.2-3.4-4.5-4.5-6.9c-4.4,3.3-9.5,6.9-15.4,10.8 c-0.2-3.4,0.1-7.1,1.1-10.9" />
                                    <path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M97.5,63.9 c-1.7-2.4-5.9-4.1-12.4-5.2c-0.9,2.2-1.8,4.3-2.5,6.5c-3.8-1.8-9.4-3.1-17-3.8c0.5,2.3,1.2,4.5,1.9,6.8c-5-0.6-11.2-0.9-18.4-1 c2,2.9,0.9,3.5,3.9,6.2" />
                                </g>
                                <g className="armR" style={{ visibility: "hidden", zIndex: 10 }}>
                                    <path fill="#ddf1fa" stroke="#3a5e77" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2.5" d="M265.4 97.3l10.4-38.6-38.9-10.5-20 36.1z" />
                                    <path fill="#ddf1fa" stroke="#3a5e77" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2.5" d="M252.4 52.4L233 47.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l10.3 2.8M226 76.4l-19.4-5.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l18.3 4.9M228.4 66.7l-23.1-6.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l23.1 6.2M235.8 58.3l-26-7c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l21.3 5.7" />
                                    <path fill="#a9ddf3" d="M207.9 74.7l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM206.7 64l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM211.2 54.8l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM234.6 49.4l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8z" />
                                    <path fill="#fff" stroke="#3a5e77" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M263.3 96.7c41.4 14.9 84.1 30.7 108.2 35.5l14-52.3C352 70 313.6 63.5 273.6 58.1" />
                                    <path fill="#fff" stroke="#3a5e77" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M278.2 59.3l-18.6-10 2.5 11.9-10.7 6.5 9.9 8.7-13.9 6.4 9.1 5.9-13.2 9.2 23.1-.9M284.5 100.1c-.4 4 1.8 8.9 6.7 14.8 3.5-1.8 6.7-3.6 9.7-5.5 1.8 4.2 5.1 8.9 10.1 14.1 2.7-2.1 5.1-4.4 7.1-6.8 4.1 3.4 9 7 14.7 11 1.2-3.4 1.8-7 1.7-10.9M314 66.7s5.4-5.7 12.6-7.4c1.7 2.9 3.3 5.7 4.9 8.6 3.8-2.5 9.8-4.4 18.2-5.7.1 3.1.1 6.1 0 9.2 5.5-1 12.5-1.6 20.8-1.9-1.4 3.9-2.5 8.4-2.5 8.4" />
                                </g>
                            </g>
                        </svg>
                    </div>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 10,
                        width: 'inherit',
                        height: 'inherit',
                        boxSizing: 'border-box',
                        border: 'solid 2.5px #217093',
                        borderRadius: '50%'
                    }} />
                </div>

                {/* Campo Email */}
                <div style={{ margin: '0 0 2em', padding: 0, position: 'relative' }}>
                    <label style={{
                        margin: '0 0 12px',
                        display: 'block',
                        fontSize: '1.25em',
                        color: '#217093',
                        fontWeight: '700',
                        fontFamily: 'inherit'
                    }}>
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onFocus={(e) => {
                            setIsFocused(true);
                            e.target.style.boxShadow = '0px 2px 10px rgba(0, 0, 0, .1)';
                            e.target.style.border = 'solid 2px #4eb8dd';
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            e.target.style.boxShadow = 'none';
                            e.target.style.border = 'solid 2px #217093';
                        }}
                        maxLength={254}
                        style={{
                            display: 'block',
                            margin: 0,
                            padding: '0.875em 1em 0',
                            backgroundColor: '#f3fafd',
                            border: 'solid 2px #217093',
                            borderRadius: '4px',
                            WebkitAppearance: 'none',
                            boxSizing: 'border-box',
                            width: '100%',
                            height: '65px',
                            fontSize: '1.2em',
                            color: '#353538',
                            fontWeight: '600',
                            fontFamily: 'inherit',
                            transition: 'box-shadow .2s linear, border-color .25s ease-out',
                            outline: 'none'
                        }}
                    />
                    <p style={{
                        position: 'absolute',
                        zIndex: 1,
                        top: 0,
                        left: 0,
                        transform: isFocused || email ? 'translate(1em, 1.55em) scale(.6)' : 'translate(1em, 2.2em) scale(1)',
                        transformOrigin: '0 0',
                        color: '#217093',
                        fontSize: '1.2em',
                        fontWeight: '400',
                        opacity: isFocused || email ? 1 : 0.65,
                        pointerEvents: 'none',
                        transition: 'transform .2s ease-out, opacity .2s linear',
                        fontFamily: 'inherit'
                    }}>
                        email@domain.com
                    </p>
                </div>

                {/* Campo Senha */}
                <div style={{ margin: '0 0 2em', padding: 0, position: 'relative' }}>
                    <label style={{
                        margin: '0 0 12px',
                        display: 'block',
                        fontSize: '1.25em',
                        color: '#217093',
                        fontWeight: '700',
                        fontFamily: 'inherit'
                    }}>
                        Senha
                    </label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Digite sua senha"
                        style={{
                            display: 'block',
                            margin: 0,
                            padding: '0.4em 1em 0.5em',
                            backgroundColor: '#f3fafd',
                            border: 'solid 2px #217093',
                            borderRadius: '4px',
                            WebkitAppearance: 'none',
                            boxSizing: 'border-box',
                            width: '100%',
                            height: '65px',
                            fontSize: '1.2em',
                            color: '#353538',
                            fontWeight: '600',
                            fontFamily: 'inherit',
                            transition: 'box-shadow .2s linear, border-color .25s ease-out',
                            outline: 'none'
                        }}
                        onFocus={(e) => {
                            e.target.style.boxShadow = '0px 2px 10px rgba(0, 0, 0, .1)';
                            e.target.style.border = 'solid 2px #4eb8dd';
                        }}
                        onBlur={(e) => {
                            e.target.style.boxShadow = 'none';
                            e.target.style.border = 'solid 2px #217093';
                        }}
                    />
                    <label style={{
                        display: 'block',
                        padding: '0 0 0 1.45em',
                        position: 'absolute',
                        top: '0.25em',
                        right: 0,
                        fontSize: '1em',
                        cursor: 'pointer'
                    }}>
                        Mostrar
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={(e) => setShowPassword(e.target.checked)}
                            style={{
                                position: 'absolute',
                                zIndex: -1,
                                opacity: 0
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            height: '0.85em',
                            width: '0.85em',
                            backgroundColor: '#f3fafd',
                            border: 'solid 2px #217093',
                            borderRadius: '3px'
                        }}>
                            <div style={{
                                content: '""',
                                position: 'absolute',
                                left: '0.25em',
                                top: '0.025em',
                                width: '0.2em',
                                height: '0.5em',
                                border: 'solid #217093',
                                borderWidth: '0 3px 3px 0',
                                transform: 'rotate(45deg)',
                                visibility: showPassword ? 'visible' : 'hidden'
                            }} />
                        </div>
                    </label>
                </div>

                {/* Botão Entrar */}
                <div style={{ margin: '0 0 0', padding: 0, position: 'relative' }}>
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            display: 'block',
                            margin: 0,
                            padding: '0.65em 1em 1em',
                            backgroundColor: isLoading ? '#a0a0a0' : '#4eb8dd',
                            border: 'none',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                            boxShadow: 'none',
                            width: '100%',
                            height: '65px',
                            fontSize: '1.2em',
                            color: '#FFF',
                            fontWeight: '600',
                            fontFamily: 'inherit',
                            transition: 'background-color .2s ease-out',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.7 : 1
                        }}
                        onMouseOver={(e) => {
                            if (!isLoading) {
                                e.currentTarget.style.backgroundColor = '#217093';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!isLoading) {
                                e.currentTarget.style.backgroundColor = '#4eb8dd';
                            }
                        }}
                    >
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
