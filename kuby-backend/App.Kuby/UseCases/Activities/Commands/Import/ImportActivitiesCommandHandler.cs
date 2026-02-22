using App.Kuby.Interfaces.Repositories;
using Mediator;

namespace App.Kuby.UseCases.Activities.Commands.Import;

public class ImportActivitiesCommandHandler : IRequestHandler<ImportActivitiesCommand, IReadOnlyCollection<int>>
{
    private readonly ITimeEntryRepository _timeEntryRepository;

    public ImportActivitiesCommandHandler(ITimeEntryRepository timeEntryRepository)
    {
        _timeEntryRepository = timeEntryRepository;
    }

    public ValueTask<IReadOnlyCollection<int>> Handle(ImportActivitiesCommand request, CancellationToken token)
    {
        return _timeEntryRepository.CreateTimeEntriesAsync(request.TimeEntriesToCreate, token);
    }
}
