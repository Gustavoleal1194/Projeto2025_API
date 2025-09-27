import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { Livro } from '../types/entities';

interface Book3DProps {
    livro: Livro;
    position: [number, number, number];
    index: number;
    isHovered: boolean;
    onHover: (id: number | null) => void;
    onToggleFavorite: (id: number) => void;
    isFavorite: (id: number) => boolean;
}

// Componente individual do livro 3D
const Book3D: React.FC<Book3DProps> = ({
    livro,
    position,
    index,
    isHovered,
    onHover,
    onToggleFavorite,
    isFavorite
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    // Animações suaves
    useFrame((state) => {
        if (meshRef.current) {
            const time = state.clock.getElapsedTime();

            // Rotação sutil baseada no tempo
            meshRef.current.rotation.y = Math.sin(time * 0.5 + index * 0.1) * 0.05;

            // Efeito de hover
            if (isHovered || hovered) {
                meshRef.current.position.y = position[1] + 0.1;
                meshRef.current.rotation.y += 0.1;
                meshRef.current.scale.setScalar(1.05);
            } else {
                meshRef.current.position.y = position[1];
                meshRef.current.scale.setScalar(1);
            }
        }
    });

    // Cores dinâmicas baseadas no ID do livro
    const bookColor = useMemo(() => {
        const colors = [
            '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#B22222',
            '#DC143C', '#B8860B', '#DAA520', '#228B22', '#32CD32',
            '#4169E1', '#0000CD', '#8A2BE2', '#9932CC', '#C71585'
        ];
        return colors[livro.id % colors.length];
    }, [livro.id]);

    return (
        <group position={position}>
            {/* Livro principal */}
            <Box
                ref={meshRef}
                args={[1.0, 1.4, 0.2]} // Aumentado o tamanho
                onPointerOver={() => {
                    setHovered(true);
                    onHover(livro.id);
                }}
                onPointerOut={() => {
                    setHovered(false);
                    onHover(null);
                }}
                onClick={() => onToggleFavorite(livro.id)}
            >
                {livro.capaUrl ? (
                    <meshBasicMaterial map={new THREE.TextureLoader().load(livro.capaUrl)} />
                ) : (
                    <meshLambertMaterial color={bookColor} />
                )}
            </Box>




            {/* Título do livro (se hovered) */}
            {(isHovered || hovered) && (
                <Text
                    position={[0, 2.0, 0]}
                    fontSize={0.18}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={2.5}
                >
                    {livro.titulo.length > 20 ? `${livro.titulo.substring(0, 20)}...` : livro.titulo}
                </Text>
            )}



            {/* Texto do botão */}
            <Text
                position={[0, 1.53, 1.0]}
                fontSize={0.28}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {isFavorite(livro.id) ? "❤️" : "🤍"}
            </Text>
        </group>
    );
};

// Componente da estante de biblioteca REAL (aberta)
const Shelf: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <group>
            {/* 6 Prateleiras abertas (todas acima da base) */}
            {Array.from({ length: 4 }, (_, index) => {
                const y = -0.5 + (index * 1.65); // Estante movida para baixo
                return (
                    <Box
                        key={index}
                        position={[0, y, 0]}
                        args={[10, 0.10, 0.8]} // Prateleira fina e rasa (como biblioteca real)
                    >
                        <meshLambertMaterial color="#8B4513" />
                    </Box>
                );
            })}

            {/* Suportes laterais (estrutura aberta) */}
            <Box
                position={[-5, 1.35, 0]}
                args={[0.15, 6.2, 0.15]}
            >
                <meshLambertMaterial color="#654321" />
            </Box>
            <Box
                position={[5.0, 1.35, 0]}
                args={[0.15, 6.2, 0.15]}
            >
                <meshLambertMaterial color="#654321" />
            </Box>

            {/* Suportes verticais internos (para estabilidade) */}
            <Box
                position={[-3.0, 1.35, 0]}
                args={[0.1, 6.2, 0.1]}
            >
                <meshLambertMaterial color="#654321" />
            </Box>
            <Box
                position={[-1.0, 1.35, 0]}
                args={[0.1, 6.2, 0.1]}
            >
                <meshLambertMaterial color="#654321" />
            </Box>
            <Box
                position={[3.0, 1.35, 0]}
                args={[0.1, 6.2, 0.1]}
            >
                <meshLambertMaterial color="#654321" />
            </Box>
            <Box
                position={[1.0, 1.35, 0]}
                args={[0.1, 6.2, 0.1]}
            >
                <meshLambertMaterial color="#654321" />
            </Box>

            {/* Base da estante */}
            <Box
                position={[0, 0, 0]}
                args={[10, 0, 0]}
            >
                <meshLambertMaterial color="#8B4513" />
            </Box>

            {/* SEM FUNDO - estante aberta como biblioteca real */}

            {children}
        </group>
    );
};

// Componente principal da estante 3D
interface Bookshelf3DProps {
    livros: Livro[];
    searchQuery: string;
    onToggleFavorite: (id: number) => void;
    isFavorite: (id: number) => boolean;
}

const Bookshelf3D: React.FC<Bookshelf3DProps> = ({
    livros,
    searchQuery,
    onToggleFavorite,
    isFavorite
}) => {
    const [hoveredBookId, setHoveredBookId] = useState<number | null>(null);

    // Filtrar livros baseado na busca
    const filteredLivros = useMemo(() => {
        if (searchQuery.trim() === '') return livros;

        return livros.filter(livro =>
            livro.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (livro.nomeAutor && livro.nomeAutor.toLowerCase().includes(searchQuery.toLowerCase())) ||
            livro.genero.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [livros, searchQuery]);

    // Posicionar livros na estante com 6 prateleiras
    const bookPositions = useMemo(() => {
        const positions: [number, number, number][] = [];
        const booksPerRow = 5; // 5 livros por prateleira
        const bookSpacing = 2; // Espaçamento entre livros (ajustado para prateleira aberta)

        filteredLivros.forEach((_, index) => {
            const totalRows = Math.ceil(filteredLivros.length / booksPerRow);
            const row = totalRows - 1 - Math.floor(index / booksPerRow);
            const col = index % booksPerRow;

            // Centralizar horizontalmente na estante
            const x = (col - (booksPerRow - 1) / 2) * bookSpacing;

            // Posicionar nas prateleiras abertas (estante movida para baixo)
            // Prateleira 0: y = -0.5, Prateleira 1: y = 1.15, etc.
            const shelfY = -0.25 + (row * 0.9);
            const y = shelfY + 1.15; // Livros em cima da prateleira (altura 0.15)

            const z = -0.10; // Pequeno offset para frente da prateleira

            positions.push([x, y, z]);
        });

        return positions;
    }, [filteredLivros]);

    return (
        <div className="w-full h-[600px] bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 rounded-2xl overflow-hidden shadow-2xl">
            <Canvas
                camera={{ position: [0, 2, 15], fov: 45 }}
                style={{ width: '100%', height: '100%' }}
            >
                {/* Iluminação profissional */}
                <ambientLight intensity={0.4} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={1}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                />
                <pointLight position={[-10, 10, -10]} intensity={0.5} color="#FFE4B5" />
                <spotLight
                    position={[0, 10, 0]}
                    angle={0.3}
                    penumbra={1}
                    intensity={0.8}
                    castShadow
                />

                {/* Ambiente */}
                <Environment preset="sunset" />

                {/* Controles de câmera */}
                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    enableRotate={true}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2.5}
                    minDistance={8}
                    maxDistance={25}
                />

                {/* Estante */}
                <Shelf>
                    {filteredLivros.map((livro, index) => (
                        <Book3D
                            key={livro.id}
                            livro={livro}
                            position={bookPositions[index]}
                            index={index}
                            isHovered={hoveredBookId === livro.id}
                            onHover={setHoveredBookId}
                            onToggleFavorite={onToggleFavorite}
                            isFavorite={isFavorite}
                        />
                    ))}
                </Shelf>

                {/* Texto da estante vazia */}
                {filteredLivros.length === 0 && (
                    <Text
                        position={[0, 0, 0]}
                        fontSize={0.5}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {searchQuery.trim() === '' ? '📚 Sua estante está vazia' : '🔍 Nenhum livro encontrado'}
                    </Text>
                )}
            </Canvas>

            {/* Controles de interface */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-4 py-2">
                    <h3 className="text-white text-lg font-semibold">
                        Minha Estante Virtual
                    </h3>
                    <p className="text-amber-200 text-sm">
                        {filteredLivros.length} livro{filteredLivros.length !== 1 ? 's' : ''}
                    </p>
                </div>

                <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-4 py-2">
                    <p className="text-amber-200 text-sm">
                        💡 Use o mouse para navegar na estante
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Bookshelf3D;
