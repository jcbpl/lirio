# Style

## Ruby

### Classes

Order members as class methods, public instance methods (`initialize` first), then `private`. Indent methods under `private` with no blank line after the keyword. Order private methods by invocation—a caller appears before the methods it calls.

```ruby
class Signup
  def create
    create_account
    send_welcome
  end

  private
    def create_account
      # ...
    end

    def send_welcome
      # ...
    end
end
```

### Conditionals

Prefer expanded conditionals over guard clauses. A guard clause is fine at the very top of a method when the main body is non-trivial, and `before_action` methods are natural guard clauses. Avoid scattering guard returns through a method.

### Resources

Model endpoints as CRUD operations. When an action does not fit a standard verb, introduce a new resource instead of a custom action. Keep logic in Active Record models and POROs, not controllers.

### POROs

When a controller action needs to coordinate multiple steps or return structured results, extract the work into a plain Ruby class in app/models. The class exposes method and results the controller needs to render a response.

## HTML

### Attributes

When an HTML tag (not SVG or ERB) would exceed 100 columns, put each attribute on its own line indented two spaces. Order attributes as:

1. Structural — id, type, name, href, src, for, action, method
2. Stimulus/data — data-controller, data-action, data-`*`-target, data-`*`-value
3. Content — alt, title, placeholder, value
4. Behavioral — loading, autocomplete, required, disabled
5. class — always last
