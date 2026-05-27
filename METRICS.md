# METRICS.md

## North Star Metric

**Qualified leads generated per week** — defined as audit completions where total monthly savings > $100 and the user submits their email.

This is the right north star because the tool exists to generate leads for Credex. DAU or total audits would be vanity metrics — what matters is how many people with real savings opportunities identify themselves and opt in.

## 3 Input Metrics That Drive the North Star

### 1. Audit completion rate
Percentage of users who land on the form and actually click "Analyze Spend & Find Savings."
If this is low, the form is too long or the landing page isn't convincing enough.
Target: >60% of form page visitors complete the audit.

### 2. Email capture rate on high-savings audits
Percentage of users who see >$100/month savings and submit their email.
This is the most direct lever on the north star.
Target: >25% of high-savings audit viewers submit email.

### 3. Shareable URL click-through rate
How often the public audit URL gets opened by someone other than the original user.
This measures the viral loop — if people share their results, acquisition is free.
Target: >15% of audits generate at least one external view.

## What I'd Instrument First

1. Audit form submission event — track how many people start vs complete the form
2. Results page view with savings bucket — $0, $1-99, $100-499, $500+
3. Email capture form submission — with savings amount at time of submission
4. Shareable URL views — distinguish original user vs new visitor by checking if audit ID was previously seen

## Pivot Trigger

If after 500 audit completions the email capture rate on high-savings audits is below 10%, the value proposition isn't landing clearly enough on the results page. That would trigger a redesign of the results page hero and CTA, not the audit logic itself.

If after 1000 audits the average savings shown is below $50/month, the audit rules need revisiting.
