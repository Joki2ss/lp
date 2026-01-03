import React from 'react';
import Svg, { Path } from 'react-native-svg';

function StrokeIcon({ color, size, children }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* subtle depth: soft shadow stroke */}
      <Path d="" />
      {children({ stroke: color, size })}
    </Svg>
  );
}

function strokeProps(color) {
  return {
    stroke: color,
    strokeWidth: 1.9,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
}

export function HomeIcon({ color = '#000', size = 22 }) {
  return (
    <StrokeIcon color={color} size={size}>
      {() => (
        <Path
          {...strokeProps(color)}
          d="M3 11.5 12 4l9 7.5M6.5 10.5V20h11V10.5"
        />
      )}
    </StrokeIcon>
  );
}

export function DashboardIcon({ color = '#000', size = 22 }) {
  return (
    <StrokeIcon color={color} size={size}>
      {() => (
        <Path
          {...strokeProps(color)}
          d="M4 20V4m0 16h16M8 15l3-3 3 2 4-6"
        />
      )}
    </StrokeIcon>
  );
}

export function EditorIcon({ color = '#000', size = 22 }) {
  return (
    <StrokeIcon color={color} size={size}>
      {() => (
        <Path
          {...strokeProps(color)}
          d="M8 20h8M7 17l10-10 2 2-10 10H7v-2Z"
        />
      )}
    </StrokeIcon>
  );
}

export function MessagesIcon({ color = '#000', size = 22 }) {
  return (
    <StrokeIcon color={color} size={size}>
      {() => (
        <Path
          {...strokeProps(color)}
          d="M21 13a7 7 0 0 1-7 7H7l-4 3V6a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v7Z"
        />
      )}
    </StrokeIcon>
  );
}

export function BellIcon({ color = '#000', size = 22 }) {
  return (
    <StrokeIcon color={color} size={size}>
      {() => (
        <Path
          {...strokeProps(color)}
          d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Zm-8 12a2 2 0 0 0 4 0"
        />
      )}
    </StrokeIcon>
  );
}

export function UserIcon({ color = '#000', size = 22 }) {
  return (
    <StrokeIcon color={color} size={size}>
      {() => (
        <Path
          {...strokeProps(color)}
          d="M20 21a8 8 0 1 0-16 0m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        />
      )}
    </StrokeIcon>
  );
}

export function SettingsIcon({ color = '#000', size = 22 }) {
  return (
    <StrokeIcon color={color} size={size}>
      {() => (
        <Path
          {...strokeProps(color)}
          d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm8.2-3.5-.9-.5.1-1.1.7-.8-1.6-2.8-1 .4-1-.5-.3-1.1H9.8l-.3 1.1-1 .5-1-.4L6 9.6l.7.8.1 1.1-.9.5.9.5-.1 1.1-.7.8 1.6 2.8 1-.4 1 .5.3 1.1h4.4l.3-1.1 1-.5 1 .4 1.6-2.8-.7-.8-.1-1.1.9-.5Z"
        />
      )}
    </StrokeIcon>
  );
}

export function PlusIcon({ color = '#000', size = 22 }) {
  return (
    <StrokeIcon color={color} size={size}>
      {() => <Path {...strokeProps(color)} d="M12 5v14M5 12h14" />}
    </StrokeIcon>
  );
}

export function SearchIcon({ color = '#000', size = 22 }) {
  return (
    <StrokeIcon color={color} size={size}>
      {() => (
        <Path
          {...strokeProps(color)}
          d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm10 2-4.3-4.3"
        />
      )}
    </StrokeIcon>
  );
}

export function ChevronUpIcon({ color = '#000', size = 18 }) {
  return (
    <StrokeIcon color={color} size={size}>
      {() => <Path {...strokeProps(color)} d="M6 14l6-6 6 6" />}
    </StrokeIcon>
  );
}

export function ChevronDownIcon({ color = '#000', size = 18 }) {
  return (
    <StrokeIcon color={color} size={size}>
      {() => <Path {...strokeProps(color)} d="M6 10l6 6 6-6" />}
    </StrokeIcon>
  );
}
