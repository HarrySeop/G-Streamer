const Footer = () => {
  return (
    <footer className="border-t py-4">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} G-Streamer. All rights reserved.</p>
        <p className="mt-2">
          Made with ❤️ by{' '}
          <a
            href="https://github.com/Harry-Seo"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Harry Seo
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
