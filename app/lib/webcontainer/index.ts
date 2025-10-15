import { WebContainer } from '@webcontainer/api';
import { WORK_DIR_NAME } from '~/utils/constants';

interface WebContainerContext {
  loaded: boolean;
}

export const webcontainerContext: WebContainerContext = import.meta.hot?.data.webcontainerContext ?? {
  loaded: false,
};

if (import.meta.hot) {
  import.meta.hot.data.webcontainerContext = webcontainerContext;
}

export let webcontainer: Promise<WebContainer> = new Promise(() => {
  // noop for ssr
});

if (typeof window !== 'undefined') {
  webcontainer =
    import.meta.hot?.data.webcontainer ??
    WebContainer.boot({ workdirName: WORK_DIR_NAME }).then((wc) => {
      webcontainerContext.loaded = true;
      return wc;
    });

  if (import.meta.hot) {
    import.meta.hot.data.webcontainer = webcontainer;
  }
}
