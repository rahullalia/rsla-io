/**
 * LogoMarquee — "We integrate with" dual-row logo strip.
 * Pure CSS marquee — no Magic UI. Two copies of content, translateX(-50%).
 * Row 1 scrolls left, Row 2 scrolls right.
 */

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
        <div className="shrink-0 flex items-center justify-center px-5 md:px-8">
            <img
                src={`/images/logos/${file}`}
                alt={name}
                width="80"
                height="40"
                className="h-7 md:h-10 w-auto max-w-[80px] md:max-w-[120px] object-contain opacity-75 hover:opacity-100 transition-opacity duration-200"
            />
        </div>
    );
}

function MarqueeTrack({ logos, reverse = false, duration = '35s' }) {
    const style = {
        '--marquee-duration': duration,
    };

    return (
        <div className="overflow-hidden">
            <div
                className={`flex w-max will-change-transform ${reverse ? 'animate-marquee-reverse' : 'animate-marquee-scroll'}`}
                style={style}
            >
                {logos.map((logo) => <LogoItem key={`a-${logo.name}`} {...logo} />)}
                {logos.map((logo) => <LogoItem key={`b-${logo.name}`} {...logo} />)}
            </div>
        </div>
    );
}

export default function LogoMarquee() {
    return (
        <section className="w-full bg-surfaceAlt border-y border-accent-border py-8 md:py-10">
            <p className="text-center font-mono text-xs uppercase tracking-widest text-textMuted mb-6 md:mb-8">
                We integrate with
            </p>
            <div className="relative flex flex-col gap-5 md:gap-7 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                <MarqueeTrack logos={row1} duration="30s" />
                <MarqueeTrack logos={row2} reverse duration="35s" />
            </div>
        </section>
    );
}
