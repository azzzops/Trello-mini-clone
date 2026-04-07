    import {MoonStar, Sun} from 'lucide-react';
    import { useTheme } from '../hooks/theme';
    import {motion} from 'framer-motion'
    export default function ToggleButton(){

        const {theme, toggleTheme} = useTheme();

        return (
            <>
                <button onClick={toggleTheme} className='dark:bg-[#1A1C20] dark:border-none border-2 border-gray-800/20 border-dashed cursor-pointer p-2 rounded-[10px] '>
                    <motion.div
                    initial={false}
                    animate={{ rotate: theme === 'dark' ? 180 : 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}>
                        {theme == 'dark' ? <MoonStar strokeWidth={2} className='text-black/90 dark:text-letters w-4 h-4 text-sm' /> : <Sun strokeWidth={2} className='text-black/90 dark:text-letters w-4 h-4' />}
                    </motion.div>
                </button>
            </>
        )
    }