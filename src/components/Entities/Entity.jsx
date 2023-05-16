import { useContext, useEffect } from "react";
import { EntitiesContext } from "../../contexts/EntitiesContext";

export default function Entity(props) {

	const { entity, weather, children, onWeatherUpdate, ...restProps } = props;
	const { collectEntity } = useContext( EntitiesContext );

	useEffect(() => {
		if (onWeatherUpdate) onWeatherUpdate(weather);
	}, [weather]);

	function handleClick(e) {
		if (restProps.onClick) restProps.onClick(e);
		collectEntity(entity, true);
	}

	function composeClassName() {
		const classes = ['entity'];
		if (entity && entity.collected) classes.push('collected');
		if (restProps.className) classes.push(restProps.className);

		return classes.join(' ');
	}

	return (
		<div
			keyname={entity ? entity.keyName : ''}
			{...restProps}
			onClick={handleClick}
			className={composeClassName()}
		>
			{children}
		</div>
	);
}
