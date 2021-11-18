import * as React from 'react';

import { Tab, Tabs } from './Tabs';

const MDX_CLASS_NAME_TO_TAB_NAME = {
  'language-swift': 'Swift',
  'language-kotlin': 'Kotlin',
  'language-javascript': 'JavaScript',
  'language-typescript': 'TypeScript',
};

export function CodeSamplesTabs({ children }) {
  const childrenArray = Array.isArray(children) ? children : [children];
  const codeBlocks = childrenArray.filter(
    ({ props }) => props.mdxType === 'pre' && props.children.props.className
  );
  const tabNames = codeBlocks.map(child => {
    const className = child.props.children.props.className;
    return MDX_CLASS_NAME_TO_TAB_NAME[className] || '[unknown]';
  });

  return (
    <Tabs tabs={tabNames} panelStyle={{ marginTop: -20 }}>
      {codeBlocks.map((codeBlock, index) => (
        <Tab key={index}>{codeBlock}</Tab>
      ))}
    </Tabs>
  );
}

export function DetailedCodeSamplesTabs(props) {
  const summary = props.summary ?? 'Details';

  return (
    <details style={{ marginTop: -15 }}>
      <summary>{summary}</summary>
      <CodeSamplesTabs>{props.children}</CodeSamplesTabs>
    </details>
  );
}
