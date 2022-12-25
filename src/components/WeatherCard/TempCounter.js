import { useSpring, animated } from 'react-spring';

export default function TempCounter({ from, to, className }) {
    const springProps = useSpring({
        number: to,
        from: { number: from },
        config: { easing: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t, duration: 2000 }
    });

    return <animated.span className={className ?? ''}>{springProps.number.to((val => Math.floor(val)))}</animated.span>
}