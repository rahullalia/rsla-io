/**
 * LogoMarquee — "We integrate with" dual-row logo strip.
 * Row 1 scrolls left, Row 2 scrolls right. surfaceAlt background.
 */

import { Marquee } from '@/components/ui/marquee';

const row1 = [
    { name: 'Anthropic',     file: 'anthropic.svg'  },
    { name: 'Claude',        file: 'claude.svg'      },
    { name: 'Make',          file: 'make.png'        },
    { name: 'n8n',           file: 'n8n.svg'         },
    { name: 'Zapier',        file: 'zapier.svg'      },
    { name: 'Notion',        file: 'notion.svg'      },
    { name: 'Vercel',        file: 'vercel.svg'      },
    { name: 'GitHub',        file: 'github.svg'      },
    { name: 'Supabase',      file: 'supabase.svg'    },
    { name: 'Airtable',      file: 'airtable.svg'    },
    { name: 'GoHighLevel',   file: 'gohighlevel.png' },
    { name: 'Slack',         file: 'slack.svg'       },
    { name: 'Google Ads',    file: 'googleads.svg'   },
    { name: 'LinkedIn',      file: 'linkedin.svg'    },
];

const row2 = [
    { name: 'ChatGPT',       file: 'chatgpt.svg'     },
    { name: 'Stripe',        file: 'stripe.svg'      },
    { name: 'VS Code',       file: 'vscode.svg'      },
    { name: 'Google Gemini', file: 'gemini.svg'      },
    { name: 'Sanity',        file: 'sanity.svg'      },
    { name: 'Upstash Redis', file: 'redis.png'       },
    { name: 'Resend',        file: 'resend.svg'      },
    { name: 'Antigravity',   file: 'antigravity.png' },
    { name: 'Instantly',     file: 'instantly.png'   },
    { name: 'Meta',          file: 'meta.svg'        },
    { name: 'Twilio',        file: 'twilio.svg'      },
    { name: 'TikTok',        file: 'tiktok.svg'      },
    { name: 'YouTube',       file: 'youtube.svg'     },
];

function LogoItem({ name, file }) {
    return (
        <div className="flex items-center justify-center mx-5 md:mx-8">
            <img
                src={`/images/logos/${file}`}
                alt={name}
                className="h-7 md:h-10 w-auto object-contain opacity-75 hover:opacity-100 transition-opacity duration-200"
                loading="lazy"
            />
        </div>
    );
}

export default function LogoMarquee() {
    return (
        <section className="w-full bg-surfaceAlt border-y border-accent-border py-8 md:py-10">
            <p className="text-center font-mono text-xs uppercase tracking-widest text-textMuted mb-6 md:mb-8">
                We integrate with
            </p>
            <div className="relative flex flex-col gap-6 md:gap-8 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
                <Marquee pauseOnHover className="[--duration:35s] md:[--duration:45s]">
                    {row1.map((logo) => <LogoItem key={logo.name} {...logo} />)}
                </Marquee>
                <Marquee pauseOnHover reverse className="[--duration:42s] md:[--duration:55s]">
                    {row2.map((logo) => <LogoItem key={logo.name} {...logo} />)}
                </Marquee>
            </div>
        </section>
    );
}
