import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface StepsPageProps {
  brand: Brand;
  lang?: Language;
}

/* -------------------------------------------------------------------------- */
/*  Constants — from Figma property surface                                   */
/* -------------------------------------------------------------------------- */

type StepsDirection = 'Horizontal' | 'Vertical';
type StepsCount = 2 | 3 | 4 | 5 | 6 | 7 | 8;
type StepsType = 'Number' | 'Icon';

const DIRECTIONS: StepsDirection[] = ['Horizontal', 'Vertical'];
const COUNTS: StepsCount[] = [2, 3, 4, 5, 6, 7, 8];
const FILLS = ['Off', 'On'] as const;
const TYPES: StepsType[] = ['Number', 'Icon'];

/* -------------------------------------------------------------------------- */
/*  Localised copy                                                            */
/* -------------------------------------------------------------------------- */

const COPY = {
  en: {
    directionLabel: 'Direction',
    countLabel: 'Count',
    backgroundFillLabel: 'Backgroung Fill',
    typeLabel: 'Type',
    title: 'Steps',
    description:
      'Represents a series of sequential stages in a process. Use for onboarding, checkout, or setup workflows where progress tracking is useful.',
    feedbackBadge: 'Feedback',
    stableBadge: 'Stable',
    anatomyTitle: 'Anatomy',
    anatomyLead: 'Each step exposes three visual parts, plus an optional surrounding card.',
    parts: [
      {
        num: '1',
        label: 'Step circle',
        desc: '18 × 18 circle (999 radius). Fills with brand-primary-pressed-brand. Contains either a 10px Medium numeric label (Type = Number) or a 12 × 12 checkmark (Type = Icon).',
      },
      {
        num: '2',
        label: 'Connector',
        desc: '1px dashed line between adjacent circles using the divider border token. 4px gap on the circle side; stretches to fill available space.',
      },
      {
        num: '3',
        label: 'Label pair',
        desc: 'Title at 14px Medium (20px line-height) and optional Body at 12px Regular (18px line-height), both in fg-primary. 12px trailing padding keeps labels clear of the next step.',
      },
    ],
    variantsTitle: 'Variants',
    variantsLead: 'Four variant properties combine to 36 concrete variants in Figma.',
    variantsHeaderProperty: 'Property',
    variantsHeaderValues: 'Values',
    variantsHeaderDefault: 'Default',
    variantRows: [
      { prop: 'Direction', values: 'Horizontal · Vertical', def: 'Horizontal' },
      { prop: 'Count', values: '2 · 3 · 4 · 5 · 6 · 7 · 8', def: '5' },
      { prop: 'Backgroung Fill', values: 'Off · On', def: 'Off' },
      { prop: 'Type', values: 'Number · Icon', def: 'Number' },
    ],
    tokensTitle: 'Design Tokens',
    tokensLead:
      'Tokens used by the Steps component. Swatches repaint to match the active brand.',
    tokensHeaderRole: 'Role',
    tokensHeaderToken: 'Token',
    tokensHeaderValue: 'Value',
    tokensHeaderSwatch: 'Swatch',
    tokenRoles: {
      'Step circle background': 'Step circle background',
      'Step number / icon fill': 'Step number / icon fill',
      'Connector divider (1px dashed)': 'Connector divider (1px dashed)',
      'Title / Body text': 'Title / Body text',
      'Card surface (Backgroung Fill = On)': 'Card surface (Backgroung Fill = On)',
    } as Record<string, string>,
    a11yTitle: 'Accessibility',
    a11yLead: 'Guidance for implementing inclusive progress sequences.',
    a11yRows: [
      {
        icon: '📍',
        title: 'Mark the current step',
        body: 'Apply aria-current="step" to the active step so assistive technologies can announce which step the user is on.',
      },
      {
        icon: '📋',
        title: 'Use ordered list semantics',
        body: 'Wrap the step sequence in role="list" with role="listitem" children so screen readers understand the sequential order.',
      },
      {
        icon: '🏷️',
        title: 'Label every step circle',
        body: 'Each step circle must carry a text alternative — a visible label beside it or an aria-label on the circle itself.',
      },
      {
        icon: '📢',
        title: 'Announce progress changes',
        body: 'When the current step advances, use an aria-live="polite" region so progress updates are spoken without hijacking focus.',
      },
      {
        icon: '🎨',
        title: 'Meet contrast targets',
        body: 'Step circle fill against its background, and number/icon fill against the circle, must both clear the 4.5:1 contrast ratio across every brand.',
      },
      {
        icon: '⌨️',
        title: 'Keep focus operable when interactive',
        body: 'If step labels link back to completed stages, each must be reachable by Tab and activate on Enter / Space.',
      },
    ],
    usageTitle: 'Usage',
    usageLead: 'When to reach for each variant property.',
    usageRows: [
      {
        title: 'Horizontal',
        body: 'Use across the top of a page for multi-step flows with 2–5 stages — onboarding, checkout, setup wizards — where there is enough horizontal space for the labels.',
      },
      {
        title: 'Vertical',
        body: 'Use inside a narrow column or sidebar. Ideal for longer processes (up to 8 steps), timeline-style displays, or when each step needs a descriptive body text.',
      },
      {
        title: 'Backgroung Fill = On',
        body: 'Adds a white card around the step sequence with 16px padding (16px radius horizontal, 8px radius vertical). Use when the surrounding surface is tinted or visually busy.',
      },
      {
        title: 'Type = Icon',
        body: 'Replaces numeric labels with a 12×12 checkmark. Use when the sequence reads more as a checklist than a numbered progression.',
      },
    ],
    doLabel: 'Do',
    dontLabel: "Don't",
    doItems: [
      'Use Steps to show clear progress through a defined, sequential workflow',
      "Keep Titles short (one or two words) so horizontal layouts don't wrap",
      'Switch to Vertical direction on narrow viewports rather than truncating labels',
    ],
    dontItems: [
      "Don't use Steps for non-sequential navigation — use Tabs instead",
      "Don't exceed 8 steps — break longer processes into grouped stages",
      "Don't rely on the circle fill alone to indicate progress — pair it with a Title",
    ],
    titleStub: 'Title',
    bodyStub: 'Body',
  },
  zh: {
    directionLabel: '方向',
    countLabel: '数量',
    backgroundFillLabel: '背景填充',
    typeLabel: '类型',
    title: '步骤',
    description:
      '表示流程中一系列连续的阶段。用于需要进度跟踪的入门引导、结账或设置工作流。',
    feedbackBadge: '反馈',
    stableBadge: '稳定',
    anatomyTitle: '组成结构',
    anatomyLead: '每个步骤包含三个视觉部分,以及可选的环绕卡片。',
    parts: [
      {
        num: '1',
        label: '步骤圆点',
        desc: '18 × 18 圆形 (999 圆角)。使用 brand-primary-pressed-brand 填充。包含 10px Medium 数字标签 (Type = Number) 或 12 × 12 复选标记 (Type = Icon)。',
      },
      {
        num: '2',
        label: '连接线',
        desc: '相邻圆点之间使用分隔符边框令牌的 1px 虚线。圆点侧 4px 间距;延伸以填充可用空间。',
      },
      {
        num: '3',
        label: '标签对',
        desc: '标题为 14px Medium (20px 行高),可选正文为 12px Regular (18px 行高),均使用 fg-primary。12px 尾部内边距让标签与下一个步骤分开。',
      },
    ],
    variantsTitle: '变体',
    variantsLead: '四个变体属性组合在 Figma 中产生 36 个具体变体。',
    variantsHeaderProperty: '属性',
    variantsHeaderValues: '值',
    variantsHeaderDefault: '默认值',
    variantRows: [
      { prop: 'Direction', values: 'Horizontal · Vertical', def: 'Horizontal' },
      { prop: 'Count', values: '2 · 3 · 4 · 5 · 6 · 7 · 8', def: '5' },
      { prop: 'Backgroung Fill', values: 'Off · On', def: 'Off' },
      { prop: 'Type', values: 'Number · Icon', def: 'Number' },
    ],
    tokensTitle: '设计令牌',
    tokensLead:
      'Steps 组件使用的令牌。色板会根据当前品牌重新着色。',
    tokensHeaderRole: '角色',
    tokensHeaderToken: '令牌',
    tokensHeaderValue: '值',
    tokensHeaderSwatch: '色板',
    tokenRoles: {
      'Step circle background': '步骤圆点背景',
      'Step number / icon fill': '步骤数字 / 图标填充',
      'Connector divider (1px dashed)': '连接线分隔符 (1px 虚线)',
      'Title / Body text': '标题 / 正文',
      'Card surface (Backgroung Fill = On)': '卡片表面 (背景填充 = 开启)',
    } as Record<string, string>,
    a11yTitle: '无障碍',
    a11yLead: '实现包容性进度序列的指南。',
    a11yRows: [
      {
        icon: '📍',
        title: '标记当前步骤',
        body: '为活动步骤应用 aria-current="step",以便辅助技术能够通报用户当前所处步骤。',
      },
      {
        icon: '📋',
        title: '使用有序列表语义',
        body: '将步骤序列包裹在 role="list" 中,并使用 role="listitem" 子项,以便屏幕阅读器理解顺序。',
      },
      {
        icon: '🏷️',
        title: '为每个步骤圆点添加标签',
        body: '每个步骤圆点必须有文本替代 —— 旁边的可见标签或圆点本身的 aria-label。',
      },
      {
        icon: '📢',
        title: '通报进度变化',
        body: '当当前步骤前进时,使用 aria-live="polite" 区域,以便在不抢占焦点的情况下播报进度更新。',
      },
      {
        icon: '🎨',
        title: '满足对比度目标',
        body: '步骤圆点填充对其背景的对比度,以及数字/图标填充对圆点的对比度,在所有品牌中都必须超过 4.5:1。',
      },
      {
        icon: '⌨️',
        title: '可交互时保持焦点可操作',
        body: '如果步骤标签链接回已完成阶段,每个必须可通过 Tab 到达,并通过回车 / 空格键激活。',
      },
    ],
    usageTitle: '使用',
    usageLead: '何时使用每个变体属性。',
    usageRows: [
      {
        title: 'Horizontal',
        body: '在页面顶部用于具有 2–5 个阶段的多步流程 —— 入门引导、结账、设置向导 —— 当有足够的水平空间放置标签时。',
      },
      {
        title: 'Vertical',
        body: '在窄列或侧边栏中使用。适合较长流程(最多 8 步)、时间线式展示或每个步骤需要描述性正文时。',
      },
      {
        title: 'Backgroung Fill = On',
        body: '在步骤序列周围添加 16px 内边距的白色卡片(水平 16px 圆角,垂直 8px 圆角)。当周围表面有色彩或视觉繁忙时使用。',
      },
      {
        title: 'Type = Icon',
        body: '将数字标签替换为 12×12 复选标记。当序列更像清单而非编号进程时使用。',
      },
    ],
    doLabel: '推荐',
    dontLabel: '避免',
    doItems: [
      '使用 Steps 在已定义的顺序工作流中显示明确进度',
      '保持标题简短(一两个词),以免水平布局换行',
      '在窄视口上切换到垂直方向,而不是截断标签',
    ],
    dontItems: [
      '不要将 Steps 用于非顺序导航 —— 改用 Tabs',
      '不要超过 8 步 —— 将较长流程分成分组阶段',
      '不要仅依赖圆点填充表示进度 —— 与标题搭配',
    ],
    titleStub: '标题',
    bodyStub: '正文',
  },
} as const;

/* -------------------------------------------------------------------------- */
/*  Shared styles / helpers                                                   */
/* -------------------------------------------------------------------------- */

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const LABEL_STYLE: React.CSSProperties = {
  margin: '0 0 8px',
  fontSize: '11px',
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

const LINE: React.CSSProperties = { width: '1px', height: '28px', backgroundColor: '#94a3b8' };

function CalloutDot({ num }: { num: string }) {
  return (
    <span
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: '#1e293b',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: 700,
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        flexShrink: 0,
      }}
    >
      {num}
    </span>
  );
}

function SegBtn({
  active,
  onClick,
  children,
  flex = 1,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  flex?: number;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex,
        padding: '5px 4px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: active ? '#fff' : 'transparent',
        color: active ? '#111827' : '#6b7280',
        fontSize: '11px',
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        boxShadow: active ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.15s ease',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Steps preview — mirrors Figma geometry 1:1                                */
/* -------------------------------------------------------------------------- */

const CIRCLE_BG = 'var(--atom-background-primary-bg-primary-pressed-brand, #0a2333)';
const CIRCLE_FG = 'var(--atom-foreground-primary-fg-brand-primary-inverse, #ffffff)';
const CONNECTOR = 'var(--atom-border-default-border-divider, #cdcbcb)';
const TEXT_COLOR = 'var(--atom-foreground-core-fg-primary, #4b4a4a)';
const CARD_BG = 'var(--atom-background-primary-bg-primary-inverse, #ffffff)';
const FONT = 'var(--atom-font-body, Poppins, sans-serif)';

function CheckmarkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M10 3L4.5 9L2 6.5"
        stroke={CIRCLE_FG}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StepCircle({ index, type }: { index: number; type: StepsType }) {
  return (
    <div
      style={{
        width: '18px',
        height: '18px',
        borderRadius: '999px',
        backgroundColor: CIRCLE_BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {type === 'Icon' ? (
        <CheckmarkIcon />
      ) : (
        <span
          style={{
            fontSize: '10px',
            lineHeight: '12px',
            fontWeight: 500,
            color: CIRCLE_FG,
            fontFamily: FONT,
          }}
        >
          {index + 1}
        </span>
      )}
    </div>
  );
}

function StepsPreview({
  direction,
  count,
  backgroundFill,
  type,
  mini = false,
  titleStub,
  bodyStub,
}: {
  direction: StepsDirection;
  count: StepsCount;
  backgroundFill: boolean;
  type: StepsType;
  /** compact rendering for the variants grid — hides body text + shrinks fonts */
  mini?: boolean;
  titleStub: string;
  bodyStub: string;
}) {
  const items = Array.from({ length: count }, () => ({
    title: titleStub,
    body: mini ? '' : bodyStub,
  }));

  const titleStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: mini ? '12px' : '14px',
    fontWeight: 500,
    lineHeight: mini ? '16px' : '20px',
    color: TEXT_COLOR,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: mini ? '10px' : '12px',
    fontWeight: 400,
    lineHeight: mini ? '14px' : '18px',
    color: TEXT_COLOR,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const wrapperStyle: React.CSSProperties = backgroundFill
    ? {
        backgroundColor: CARD_BG,
        padding: '16px',
        borderRadius: direction === 'Horizontal' ? '16px' : '8px',
        boxShadow: '0 1px 2px rgba(10, 35, 51, 0.06)',
        width: direction === 'Horizontal' ? '100%' : 'auto',
        boxSizing: 'border-box',
      }
    : {};

  if (direction === 'Horizontal') {
    return (
      <div style={wrapperStyle}>
        <div
          style={{
            display: 'flex',
            width: '100%',
            fontFamily: FONT,
          }}
        >
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  minWidth: 0,
                }}
              >
                {/* content-top: circle + dashed connector */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    height: '18px',
                  }}
                >
                  <StepCircle index={i} type={type} />
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      style={{
                        flex: 1,
                        borderTop: `1px dashed ${CONNECTOR}`,
                      }}
                    />
                  )}
                </div>
                {/* content-bottom: title + body */}
                <div
                  style={{
                    paddingRight: isLast ? 0 : '12px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span style={titleStyle}>{item.title}</span>
                  {item.body && <span style={bodyStyle}>{item.body}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Vertical
  return (
    <div style={wrapperStyle}>
      <div style={{ display: 'flex', flexDirection: 'column', fontFamily: FONT }}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <div key={i} style={{ display: 'flex', gap: '8px' }}>
              {/* content-left: circle + vertical connector */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  flexShrink: 0,
                }}
              >
                <StepCircle index={i} type={type} />
                {!isLast && (
                  <div
                    aria-hidden="true"
                    style={{
                      width: 0,
                      flex: 1,
                      minHeight: mini ? '18px' : '28px',
                      borderLeft: `1px dashed ${CONNECTOR}`,
                    }}
                  />
                )}
              </div>
              {/* content-right: title + body */}
              <div
                style={{
                  paddingBottom: isLast ? 0 : '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <span style={titleStyle}>{item.title}</span>
                {item.body && <span style={bodyStyle}>{item.body}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reference data                                                            */
/* -------------------------------------------------------------------------- */

const TOKEN_TABLE_ROWS = [
  { role: 'Step circle background', tokenKey: 'atom.background.primary.bg-primary-pressed-brand', cssVar: '--atom-background-primary-bg-primary-pressed-brand' },
  { role: 'Step number / icon fill', tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse', cssVar: '--atom-foreground-primary-fg-brand-primary-inverse' },
  { role: 'Connector divider (1px dashed)', tokenKey: 'atom.border.default.border-divider', cssVar: '--atom-border-default-border-divider' },
  { role: 'Title / Body text', tokenKey: 'atom.foreground.core.fg-primary', cssVar: '--atom-foreground-core-fg-primary' },
  { role: 'Card surface (Backgroung Fill = On)', tokenKey: 'atom.background.primary.bg-primary-inverse', cssVar: '--atom-background-primary-bg-primary-inverse' },
] as const;

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export function StepsPage({ brand, lang = 'en' }: StepsPageProps) {
  const t = COPY[lang];
  const [direction, setDirection] = useState<StepsDirection>('Horizontal');
  const [count, setCount] = useState<StepsCount>(5);
  const [backgroundFill, setBackgroundFill] = useState(false);
  const [type, setType] = useState<StepsType>('Number');

  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];
  const previewKey = `${direction}|${count}|${backgroundFill ? 'On' : 'Off'}|${type}`;

  return (
    <div className="space-y-10">

      {/* -- 1. INTERACTIVE PREVIEW -------------------------------------- */}
      <section>
        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#fff',
          }}
        >
          <div style={{ display: 'flex', minHeight: '360px' }}>
            {/* Canvas */}
            <div
              style={{
                flex: 1,
                ...DOTTED_BG,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 40px',
                overflow: 'auto',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    width: direction === 'Horizontal' ? '100%' : 'auto',
                    maxWidth: direction === 'Horizontal' ? '640px' : '360px',
                    minWidth: direction === 'Vertical' ? '320px' : undefined,
                  }}
                >
                  <StepsPreview
                    direction={direction}
                    count={count}
                    backgroundFill={backgroundFill}
                    type={type}
                    titleStub={t.titleStub}
                    bodyStub={t.bodyStub}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div
              style={{
                width: '240px',
                flexShrink: 0,
                borderLeft: '1px solid #e5e7eb',
                backgroundColor: '#fff',
                padding: '20px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
              }}
            >
              <div>
                <p style={LABEL_STYLE}>{t.directionLabel}</p>
                <div
                  style={{
                    display: 'flex',
                    padding: '2px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    gap: '2px',
                  }}
                >
                  {DIRECTIONS.map((d) => (
                    <SegBtn key={d} active={direction === d} onClick={() => setDirection(d)}>
                      {d}
                    </SegBtn>
                  ))}
                </div>
              </div>

              <div>
                <p style={LABEL_STYLE}>{t.countLabel}</p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    padding: '2px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    gap: '2px',
                  }}
                >
                  {COUNTS.map((n) => (
                    <SegBtn key={n} active={count === n} onClick={() => setCount(n)}>
                      {n}
                    </SegBtn>
                  ))}
                </div>
              </div>

              <div>
                <p style={LABEL_STYLE}>{t.backgroundFillLabel}</p>
                <div
                  style={{
                    display: 'flex',
                    padding: '2px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    gap: '2px',
                  }}
                >
                  {FILLS.map((f) => (
                    <SegBtn
                      key={f}
                      active={backgroundFill === (f === 'On')}
                      onClick={() => setBackgroundFill(f === 'On')}
                    >
                      {f}
                    </SegBtn>
                  ))}
                </div>
              </div>

              <div>
                <p style={LABEL_STYLE}>{t.typeLabel}</p>
                <div
                  style={{
                    display: 'flex',
                    padding: '2px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    gap: '2px',
                  }}
                >
                  {TYPES.map((tt) => (
                    <SegBtn key={tt} active={type === tt} onClick={() => setType(tt)}>
                      {tt}
                    </SegBtn>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- 2. COMPONENT INFO ------------------------------------------- */}
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
          {t.title}
        </h1>
        <p
          style={{
            fontSize: '15px',
            color: '#6b7280',
            lineHeight: 1.6,
            margin: '0 0 16px',
            maxWidth: '640px',
          }}
        >
          {t.description}
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <a
            href="#"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              fontSize: '13px',
              color: '#374151',
              textDecoration: 'none',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              backgroundColor: '#fff',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t.feedbackBadge}
          </a>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #bbf7d0',
              fontSize: '13px',
              color: '#166534',
              backgroundColor: '#f0fdf4',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                display: 'inline-block',
              }}
            />
            {t.stableBadge}
          </span>
        </div>
      </section>

      {/* -- 3. ANATOMY -------------------------------------------------- */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.anatomyTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>
          {t.anatomyLead}
        </p>

        <div
          style={{
            ...DOTTED_BG,
            borderRadius: '12px',
            padding: '56px 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            minHeight: '220px',
          }}
        >
          <div style={{ width: '320px' }}>
            <StepsPreview direction="Horizontal" count={3} backgroundFill={false} type="Number" titleStub={t.titleStub} bodyStub={t.bodyStub} />
          </div>

          {/* 1 — Step circle (above step-1) */}
          <div
            style={{
              position: 'absolute',
              top: '18px',
              left: 'calc(50% - 104px)',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <CalloutDot num="1" />
            <div style={LINE} />
          </div>
          {/* 2 — Connector */}
          <div
            style={{
              position: 'absolute',
              top: '18px',
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <CalloutDot num="2" />
            <div style={LINE} />
          </div>
          {/* 3 — Label pair (bottom) */}
          <div
            style={{
              position: 'absolute',
              bottom: '18px',
              left: 'calc(50% + 48px)',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={LINE} />
            <CalloutDot num="3" />
          </div>
        </div>

        <div
          style={{
            marginTop: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
          }}
        >
          {t.parts.map(({ num, label, desc }) => (
            <div
              key={num}
              style={{
                display: 'flex',
                gap: '10px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#f9fafb',
                border: '1px solid #f3f4f6',
              }}
            >
              <span
                style={{ fontSize: '16px', lineHeight: 1, flexShrink: 0, marginTop: '1px' }}
              >
                {num}
              </span>
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                  {label}
                </p>
                <p
                  style={{
                    margin: '3px 0 0',
                    fontSize: '12px',
                    color: '#6b7280',
                    lineHeight: 1.4,
                  }}
                >
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -- 4. VARIANTS ------------------------------------------------- */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.variantsTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.variantsLead}
        </p>

        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            overflow: 'hidden',
            marginBottom: '16px',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                    width: '160px',
                  }}
                >
                  {t.variantsHeaderProperty}
                </th>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                  }}
                >
                  {t.variantsHeaderValues}
                </th>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                    width: '120px',
                  }}
                >
                  {t.variantsHeaderDefault}
                </th>
              </tr>
            </thead>
            <tbody>
              {t.variantRows.map(({ prop, values, def }, i) => (
                <tr
                  key={prop}
                  style={{ borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none' }}
                >
                  <td style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>
                    {prop}
                  </td>
                  <td style={{ padding: '10px 16px', color: '#6b7280' }}>{values}</td>
                  <td style={{ padding: '10px 16px', color: '#374151' }}>
                    <code
                      style={{
                        fontSize: '11px',
                        backgroundColor: '#f3f4f6',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        color: '#6b7280',
                      }}
                    >
                      {def}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual preview grid — 6 representative variants */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
          }}
        >
          {[
            { d: 'Horizontal' as const, c: 3 as StepsCount, f: false, t: 'Number' as const, label: 'Horizontal · 3 · Off · Number' },
            { d: 'Horizontal' as const, c: 3 as StepsCount, f: false, t: 'Icon' as const, label: 'Horizontal · 3 · Off · Icon' },
            { d: 'Horizontal' as const, c: 5 as StepsCount, f: true, t: 'Number' as const, label: 'Horizontal · 5 · On · Number' },
            { d: 'Vertical' as const, c: 3 as StepsCount, f: false, t: 'Number' as const, label: 'Vertical · 3 · Off · Number' },
            { d: 'Vertical' as const, c: 4 as StepsCount, f: true, t: 'Icon' as const, label: 'Vertical · 4 · On · Icon' },
            { d: 'Vertical' as const, c: 5 as StepsCount, f: false, t: 'Number' as const, label: 'Vertical · 5 · Off · Number' },
          ].map(({ d, c, f, t: tt, label }, i) => (
            <div
              key={i}
              style={{
                padding: '16px',
                borderRadius: '10px',
                border: '1px solid #f3f4f6',
                backgroundColor: '#fafafa',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                minHeight: '160px',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#6b7280',
                  letterSpacing: '0.02em',
                }}
              >
                {label}
              </p>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <StepsPreview direction={d} count={c} backgroundFill={f} type={tt} mini titleStub={t.titleStub} bodyStub={t.bodyStub} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -- 5. DESIGN TOKENS -------------------------------------------- */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.tokensTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.tokensLead}
        </p>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                    width: '220px',
                  }}
                >
                  {t.tokensHeaderRole}
                </th>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                  }}
                >
                  {t.tokensHeaderToken}
                </th>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                    width: '100px',
                  }}
                >
                  {t.tokensHeaderValue}
                </th>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                    width: '52px',
                  }}
                >
                  {t.tokensHeaderSwatch}
                </th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const resolvedValue =
                  tokens[row.tokenKey as keyof typeof tokens] ?? '\u2014';
                return (
                  <tr
                    key={row.role}
                    style={{
                      borderBottom:
                        i < TOKEN_TABLE_ROWS.length - 1 ? '1px solid #f3f4f6' : 'none',
                      borderLeft: '3px solid #3b82f6',
                    }}
                  >
                    <td
                      style={{ padding: '10px 16px', color: '#374151', fontWeight: 600 }}
                    >
                      {t.tokenRoles[row.role] ?? row.role}
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <code
                        style={{
                          fontSize: '11px',
                          backgroundColor: '#f3f4f6',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          color: '#6b7280',
                        }}
                      >
                        {row.cssVar}
                      </code>
                    </td>
                    <td
                      style={{
                        padding: '10px 16px',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: '#6b7280',
                      }}
                    >
                      {resolvedValue.slice(0, 9)}
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      {(resolvedValue.startsWith('#') || resolvedValue.startsWith('rgb')) && (
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            backgroundColor: resolvedValue,
                            border: '1px solid rgba(0,0,0,0.08)',
                          }}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* -- 6. ACCESSIBILITY ------------------------------------------- */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.a11yTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.a11yLead}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {t.a11yRows.map(({ icon, title, body }) => (
            <div
              key={title}
              style={{
                display: 'flex',
                gap: '14px',
                padding: '16px',
                borderRadius: '10px',
                border: '1px solid #f3f4f6',
                backgroundColor: '#fafafa',
              }}
            >
              <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}>
                {icon}
              </span>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                  {title}
                </p>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: '13px',
                    color: '#6b7280',
                    lineHeight: 1.5,
                  }}
                >
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -- 7. USAGE ---------------------------------------------------- */}
      <section style={{ paddingBottom: '40px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{t.usageTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.usageLead}
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '16px',
          }}
        >
          {t.usageRows.map(({ title, body }) => (
            <div
              key={title}
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                border: '1px solid #f3f4f6',
                backgroundColor: '#fafafa',
              }}
            >
              <p
                style={{
                  margin: '0 0 4px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#111827',
                }}
              >
                {title}
              </p>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#6b7280', lineHeight: 1.5 }}>
                {body}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              border: '1px solid #bbf7d0',
              backgroundColor: '#f0fdf4',
            }}
          >
            <p
              style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}
            >
              {t.doLabel}
            </p>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                fontSize: '12.5px',
                color: '#15803d',
                lineHeight: 1.5,
              }}
            >
              {t.doItems.map((item, i) => (
                <li key={i} style={{ marginBottom: i < t.doItems.length - 1 ? '6px' : 0 }}>{item}</li>
              ))}
            </ul>
          </div>
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              border: '1px solid #fecaca',
              backgroundColor: '#fef2f2',
            }}
          >
            <p
              style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}
            >
              {t.dontLabel}
            </p>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                fontSize: '12.5px',
                color: '#b91c1c',
                lineHeight: 1.5,
              }}
            >
              {t.dontItems.map((item, i) => (
                <li key={i} style={{ marginBottom: i < t.dontItems.length - 1 ? '6px' : 0 }}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
