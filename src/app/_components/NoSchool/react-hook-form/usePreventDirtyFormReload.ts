import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Params = {
  immediate?: true;
};

/**
 * 入力中フォームの画面リロードやページ遷移を防ぐフック
 *
 * フォームで使う場合、FormコンポーネントにpreventReload propを渡すことで、離脱防止処理を有効にすることができる(フォーム送信時には自動で解除される)
 *
 * また確認画面を伴うフォームの場合、確認フォーム用のConfirmFormコンポーネントは、予め内部に離脱防止処理と送信時の離脱防止解除処理が組み込まれている
 */
export const usePreventDirtyFormReload = ({ immediate }: Params = {}) => {
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState(false);

  const enablePreventReload = useCallback(() => {
    setIsEnabled(true);
  }, []);

  const disablePreventReload = useCallback(() => {
    setIsEnabled(false);
  }, []);

  const pageChangeHandler = () => {
    const ok = window.confirm(
      "入力内容を破棄しますか？この操作は取り消しできません",
    );
    if (!ok) {
      throw "route change aborted.";
    }
  };

  const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = "";
  };

  useEffect(() => {
    if (immediate && !isEnabled) {
      enablePreventReload();
    }
  }, []);

  useEffect(() => {
    /**
     * NOTE
     * 以下App Routerで動作しない説
     */
    if (isEnabled) {
      // router.events.on("routeChangeStart", pageChangeHandler); // Next.jsのページ遷移を阻止
      // window.addEventListener("beforeunload", beforeUnloadHandler); // ブラウザのページ遷移を阻止
      //
      // return () => {
      //   router.events.off("routeChangeStart", pageChangeHandler);
      //   window.removeEventListener("beforeunload", beforeUnloadHandler);
      // };
    }
  }, [isEnabled, router]);

  return {
    isEnabled,
    enablePreventReload,
    disablePreventReload,
  };
};
