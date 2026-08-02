import React from 'react';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type {WrapperProps} from '@docusaurus/types';
import DocMarkdownActions from '@site/src/components/DocMarkdownActions';

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): React.JSX.Element {
  return (
    <>
      <DocMarkdownActions />
      <Content {...props} />
    </>
  );
}
