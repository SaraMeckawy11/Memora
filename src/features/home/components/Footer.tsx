export default function Footer() {
	return (
		<footer className="site-footer">
			<div className="container footer-inner">
				<div className="footer-left">
					<strong>Memora</strong>
					<small className="muted">© {new Date().getFullYear()} — Built for memories</small>
				</div>
				<div className="footer-right muted">
					<a href="#">Help</a>
					<a href="#">Privacy</a>
					<a href="#">Terms</a>
				</div>
			</div>
		</footer>
	)
}