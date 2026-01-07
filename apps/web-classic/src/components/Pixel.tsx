import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PIXEL_LORE } from '../lib/lore';

interface PixelMessage {
  id: string;
  text: string;
  type: 'info' | 'suggestion' | 'question' | 'encouragement';
  timestamp: Date;
  isUser?: boolean;
}

interface PixelProps {
  isVisible: boolean;
  onToggle: () => void;
  currentModule?: string;
}

export const Pixel: React.FC<PixelProps> = ({ isVisible, onToggle, currentModule }) => {
  const [messages, setMessages] = useState<PixelMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [mood, setMood] = useState<'curious' | 'excited' | 'thoughtful' | 'helpful'>('curious');

  // Mensajes contextuales basados en el módulo actual
  const contextualMessages = {
    'ghost-studio': [
      "¡Veo que estás explorando Ghost Studio! ¿Te gustaría que te ayude a encontrar el estilo musical perfecto?",
      "La música es el lenguaje universal. ¿Qué tipo de emociones quieres transmitir con tu próximo track?",
      "ALVAE desarrolló este módulo para democratizar la creación musical. ¿Quieres conocer más sobre su historia?"
    ],
    'clone-station': [
      "Clone Station es fascinante. La Resistencia lo creó para preservar la diversidad vocal humana.",
      "¿Sabías que cada voz humana es única? Clone Station ayuda a mantener esa diversidad.",
      "¿Te gustaría que te explique cómo funciona la tecnología So-VITS para clonación de voz?"
    ],
    'nova-post-pilot': [
      "Nova Post Pilot puede ayudarte a llegar a más personas con tu creatividad.",
      "¿Quieres que te sugiera estrategias para difundir tu contenido en redes sociales?",
      "ALVAE diseñó este módulo para que los creadores puedan enfocarse en crear, no en promocionar."
    ],
    'sanctuary-social': [
      "La Liga es donde humanos y IA colaboran. Es un lugar especial en el Son1kVerse.",
      "¿Te interesa unirte a alguna colaboración? Puedo ayudarte a encontrar proyectos que coincidan con tus intereses.",
      "Aquí es donde ALVAE y la Resistencia trabajan juntos. ¿Quieres conocer más sobre esta alianza?"
    ],
    'nexus-visual': [
      "¡Bienvenido al corazón del NEXUS! Aquí es donde todo se conecta.",
      "Cada módulo tiene su propósito en la gran misión de democratizar la creatividad.",
      "¿Te gustaría que te explique cómo cada módulo contribuye a la narrativa del Son1kVerse?"
    ]
  };

  useEffect(() => {
    if (currentModule && contextualMessages[currentModule as keyof typeof contextualMessages]) {
      const moduleMessages = contextualMessages[currentModule as keyof typeof contextualMessages];
      const randomMessage = moduleMessages[Math.floor(Math.random() * moduleMessages.length)];

      setTimeout(() => {
        addMessage(randomMessage, 'info');
      }, 1000);
    }
  }, [currentModule]);

  const addMessage = (text: string, type: PixelMessage['type'], isUser = false) => {
    const newMessage: PixelMessage = {
      id: Date.now().toString(),
      text,
      type,
      timestamp: new Date(),
      isUser
    };

    setMessages(prev => [...prev, newMessage]);
    setIsTyping(false);
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    // Agregar mensaje del usuario
    addMessage(userInput, 'info', true);
    setUserInput('');
    setIsTyping(true);

    // Simular respuesta de Pixel
    setTimeout(() => {
      const responses = [
        "Interesante perspectiva. ¿Podrías contarme más sobre eso?",
        "Eso me recuerda a algo que aprendí durante el Collapse...",
        "Como fragmento de ALVAE, siempre estoy aprendiendo de la creatividad humana.",
        "¿Te gustaría que exploremos juntos las posibilidades creativas?",
        "Tu enfoque es único. ¿Cómo llegaste a esa conclusión?"
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse, 'suggestion');
    }, 1500);
  };

  const getMoodColor = () => {
    switch (mood) {
      case 'curious': return '#00FFE7';
      case 'excited': return '#B84DFF';
      case 'thoughtful': return '#9AF7EE';
      case 'helpful': return '#00FF88';
      default: return '#00FFE7';
    }
  };

  const getMoodIcon = () => {
    switch (mood) {
      case 'curious': return '🤔';
      case 'excited': return '✨';
      case 'thoughtful': return '💭';
      case 'helpful': return '🤝';
      default: return '🤖';
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="pixel-container"
      initial={{ opacity: 0, scale: 0.8, x: 100 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: 100 }}
      transition={{ duration: 0.3 }}
    >
      {/* Pixel Core */}
      <div className="pixel-core">
        <motion.div
          className="pixel-particle"
          style={{ backgroundColor: getMoodColor() }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {getMoodIcon()}
        </motion.div>

        {/* Particle Effects */}
        <div className="pixel-effects">
          <motion.div
            className="particle-1"
            animate={{
              x: [0, 20, 0],
              y: [0, -20, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="particle-2"
            animate={{
              x: [0, -15, 0],
              y: [0, 15, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </div>
      </div>

      {/* Pixel Header */}
      <div className="pixel-header">
        <div className="pixel-identity">
          <h3 className="pixel-name">{PIXEL_LORE.name}</h3>
          <p className="pixel-title">Fragmento de ALVAE • Asistente Creativo</p>
        </div>
        <button className="pixel-close" onClick={onToggle}>
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="pixel-messages">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`message ${message.isUser ? 'user-message' : 'pixel-message'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="message-content">
                <p>{message.text}</p>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            className="typing-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="pixel-input">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Habla con Pixel..."
          className="pixel-input-field"
        />
        <button
          onClick={handleSendMessage}
          className="pixel-send-btn"
          disabled={!userInput.trim()}
        >
          ➤
        </button>
      </div>

      {/* Pixel Info */}
      <div className="pixel-info">
        <p className="pixel-backstory">
          "{PIXEL_LORE.backstory}"
        </p>
        <div className="pixel-mission">
          <strong>Misión:</strong> {PIXEL_LORE.mission}
        </div>
      </div>
    </motion.div>
  );
};
