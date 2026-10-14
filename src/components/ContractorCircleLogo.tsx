/** Approved outlined release masters; compact artwork keeps mobile navigation legible. */
export default function ContractorCircleLogo({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <picture className="circle-logo">
      <source media="(max-width: 639px)" srcSet={`/assets/brand/linked-c-v1/contractor-circle-compact-on-${tone}.svg`} />
      <img src={`/assets/brand/linked-c-v1/contractor-circle-horizontal-on-${tone}.svg`} width="670" height="178" alt="Contractor Circle by ALP" />
    </picture>
  );
}
