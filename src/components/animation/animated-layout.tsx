import { motion } from 'framer-motion';

interface AnimatedLayoutProps {
  children: React.ReactNode;
}

function AnimatedLayout({children}: AnimatedLayoutProps) {
  return (
    <motion.div
      className='animated-layout'
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={{
        hidden: { opacity: 0 },
        enter: { opacity: 1 },
        exit: { opacity: 0 },
      }}
      transition={{ duration: 0.5, type: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedLayout;