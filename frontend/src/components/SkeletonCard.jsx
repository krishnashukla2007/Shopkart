export function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton" style={{ width: '100%', height: '180px', borderRadius: 'var(--radius-md)' }} />
            <div className="skeleton" style={{ width: '40%', height: '14px' }} />
            <div className="skeleton" style={{ width: '85%', height: '22px' }} />
            <div className="skeleton" style={{ width: '60%', height: '18px' }} />
            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                <div className="skeleton" style={{ flex: 1, height: '36px', borderRadius: 'var(--radius-md)' }} />
                <div className="skeleton" style={{ flex: 1, height: '36px', borderRadius: 'var(--radius-md)' }} />
            </div>
        </div>
    );
}

export function SkeletonGrid({ count = 8 }) {
    return (
        <div className="products-grid">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    );
}

export default SkeletonCard;
