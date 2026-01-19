document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('btnImportar')
  const container = document.getElementById('importContainer')
  if (!btn || !container) return

  btn.addEventListener('click', function (e) {
    // Prevent default Bootstrap modal trigger from interfering with our action
    // (we still allow modal behavior)
    // e.preventDefault()

    // If input already exists, just open file picker
    const existing = container.querySelector('input[type="file"][name="sql_file"]')
    if (existing) {
      existing.click()
      return
    }

    const wrapper = document.createElement('div')
    wrapper.className = 'mt-3'

    const label = document.createElement('label')
    label.className = 'form-label'
    label.setAttribute('for', 'sql_file')
    label.textContent = 'Seleccionar archivo SQL'

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.sql'
    input.className = 'form-control'
    input.name = 'sql_file'
    input.id = 'sql_file'

    // Optional: handle file selection
    input.addEventListener('change', function () {
      if (!input.files || input.files.length === 0) return
      const file = input.files[0]
      const info = document.createElement('div')
      info.className = 'mt-2 small text-muted'
      info.textContent = `Archivo seleccionado: ${file.name} (${Math.round(file.size/1024)} KB)`
      // remove old info
      const old = container.querySelector('.file-info')
      if (old) old.remove()
      info.classList.add('file-info')
      container.appendChild(info)
    })

    wrapper.appendChild(label)
    wrapper.appendChild(input)
    container.appendChild(wrapper)

    // open file picker immediately
    input.click()
  })
})
