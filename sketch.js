document.addEventListener('DOMContentLoaded', () => {
    
    // Variável para manter a instância ativa do p5.js
    let activeP5Instance = null;
    let activeContainer = null;

    // Seleciona todos os botões que abrem os modelos 3D
    const viewButtons = document.querySelectorAll('.view-model-btn');

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modelPath = button.dataset.modelPath;
            const targetContainerId = button.dataset.canvasTarget;
            const targetContainer = document.getElementById(targetContainerId);

            // Se já existe uma instância ativa, remove-a antes de criar uma nova.
            if (activeP5Instance) {
                activeP5Instance.remove();
            }

            // Se o container clicado é diferente do anterior, cria uma nova instância.
            // Se for o mesmo, a ação de remoção acima funciona como um "toggle off".
            if (activeContainer !== targetContainer) {
                // Cria a nova instância p5.js
                activeP5Instance = new p5(sketch(modelPath), targetContainer);
                activeContainer = targetContainer;
            } else {
                // Se clicou no mesmo botão, apenas limpa as variáveis de estado.
                activeP5Instance = null;
                activeContainer = null;
            }
        });
    });

    /**
     * Função que define o comportamento do nosso sketch p5.js.
     * Ela recebe o caminho do modelo como argumento.
     * @param {string} modelPath - O caminho para o arquivo .obj do modelo 3D.
     */
    const sketch = (modelPath) => {
        return function(p) {
            let model;
            let closeButton;
            const canvasSize = 400;

            p.preload = () => {
                // Carrega o modelo 3D a partir do caminho fornecido
                model = p.loadModel(modelPath, true);
            };

            p.setup = () => {
                p.createCanvas(canvasSize, canvasSize, p.WEBGL);
                const cameraZ = (p.height / 2.0) / p.tan(p.PI * 30.0 / 180.0);
                p.camera(0, 0, cameraZ * 1.5);
                // Cria um botão "Fechar" dinamicamente
                closeButton = p.createButton('X');
                closeButton.addClass('close-canvas-btn');
                closeButton.parent(p.canvas.parentElement); // Anexa ao mesmo container do canvas
                closeButton.mousePressed(() => {
                    activeP5Instance.remove();
                    activeP5Instance = null;
                    activeContainer = null;
                });
            };

            p.draw = () => {
                p.background('#1A1A2E'); // Cor de fundo do canvas
                p.lights(); // Adiciona iluminação ambiente e direcional
                p.orbitControl(); // Permite controlar a câmera com o mouse

                p.scale(50); // Ajuste este valor dependendo do tamanho do seu modelo
                p.rotateX(p.PI); // Ajuste a orientação inicial se necessário
                p.normalMaterial(); // Material padrão para visualizar a forma
                p.model(model);
            };
        };
    };
});
