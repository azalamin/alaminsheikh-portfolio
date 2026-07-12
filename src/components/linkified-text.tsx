const URL_PATTERN = /(https?:\/\/[^\s]+)/g;
const TRAILING_PUNCTUATION = /[.,;:!?)\]}]+$/;

/** Splits trailing sentence punctuation off a matched URL so links don't swallow it. */
function splitTrailingPunctuation(url: string) {
  const match = url.match(TRAILING_PUNCTUATION);
  if (!match) return { url, trailing: "" };
  return { url: url.slice(0, -match[0].length), trailing: match[0] };
}

/**
 * Renders plain text with any http(s) URLs turned into clickable links.
 * `text.split()` with a single capturing group alternates plain text and
 * matches, starting with text — so odd indices are always URL matches.
 */
export function LinkifiedText({ text }: { text: string }) {
  const parts = text.split(URL_PATTERN);

  return (
    <>
      {parts.map((part, index) => {
        if (index % 2 === 0) {
          return part ? <span key={index}>{part}</span> : null;
        }

        const { url, trailing } = splitTrailingPunctuation(part);
        return (
          <span key={index}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              {url}
            </a>
            {trailing}
          </span>
        );
      })}
    </>
  );
}
