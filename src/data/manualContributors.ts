export type ContributorLocale = 'zh' | 'ja' | 'en';

export type LocalizedContributorText = string | Partial<Record<ContributorLocale, string>>;

export interface ManualContributor {
  /** 用于列表排序和后续稳定引用，请保持唯一。 */
  id: string;
  /** 例如：视觉协力、资料协力、翻译协力。 */
  collaboration: LocalizedContributorText;
  name: string;
  contact: {
    label: string;
    /** 可省略；支持 https://、http:// 和 mailto:。 */
    href?: string;
  };
  introduction: LocalizedContributorText;
  quote: LocalizedContributorText;
  /** 设为 false 可暂时隐藏，默认显示。 */
  enabled?: boolean;
}

/**
 * 手动维护的特别协力者名单。
 *
 * 文本可以直接填写一个字符串（所有语言共用），也可以分别填写三语：
 * { zh: '视觉协力', ja: 'ビジュアル協力', en: 'Visual support' }
 *
 * 复制下面的对象到数组中即可添加贡献者：
 * {
 *   id: 'example-name',
 *   collaboration: '资料协力',
 *   name: '贡献者名字',
 *   contact: { label: '@example', href: 'https://example.com' },
 *   introduction: '这里填写贡献者介绍。',
 *   quote: '这里填写他的一句话。',
 * },
 */
export const manualContributors: ManualContributor[] = [];
